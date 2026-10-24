import { expect, it, onTestFinished } from "vitest";
import createTestShare from "../../test-utils/createTestShare.ts";
import waitForShareSession from "../../test-utils/waitForShareSession.ts";
import hashString from "../review/hashString.ts";
import randomBase64Url from "../share-crypto/randomBase64Url.ts";
import deleteShare from "../sharing/deleteShare.ts";
import ShareSession from "./ShareSession.ts";

it("shows a participant's stored state to the others", async () => {
  // Setup SUT
  const { apiOrigin, shareId, shareKey } = await createTestShare();
  const aliceParticipantId = randomBase64Url(16);
  const aliceShareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId: aliceParticipantId,
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => aliceShareSession.close());
  aliceShareSession.dispatch({ type: "rename", name: "Alice" });
  aliceShareSession.dispatch({
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });
  await waitForShareSession(
    aliceShareSession,
    (snapshot) =>
      snapshot.connectionStatus === "connected" && !snapshot.hasPendingChanges,
  );

  // Exercise
  const bobShareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => bobShareSession.close());

  // Verify
  const bobSnapshot = await waitForShareSession(
    bobShareSession,
    (snapshot) => snapshot.connectionStatus === "connected",
  );
  expect(bobSnapshot.otherParticipantStates).toEqual(
    new Map([
      [aliceParticipantId, { name: "Alice", viewedFingerprints: ["a1"] }],
    ]),
  );
});

it("tells that a participant is new until they change their state", async () => {
  // Setup SUT
  const { apiOrigin, shareId, shareKey } = await createTestShare();

  // Exercise
  const shareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => shareSession.close());

  // Verify
  const snapshot = await waitForShareSession(
    shareSession,
    (shareSessionSnapshot) =>
      shareSessionSnapshot.connectionStatus === "connected",
  );
  expect(snapshot.isNewParticipant).toBe(true);
});

it("keeps the changes made at once in two tabs of the same participant", async () => {
  // Setup SUT
  const { apiOrigin, shareId, shareKey } = await createTestShare();
  const participant = {
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  };
  const firstTabShareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    ...participant,
  });
  onTestFinished(() => firstTabShareSession.close());
  const secondTabShareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    ...participant,
  });
  onTestFinished(() => secondTabShareSession.close());
  await Promise.all(
    [firstTabShareSession, secondTabShareSession].map((shareSession) =>
      waitForShareSession(
        shareSession,
        (snapshot) => snapshot.connectionStatus === "connected",
      ),
    ),
  );

  // Exercise
  firstTabShareSession.dispatch({
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });
  secondTabShareSession.dispatch({
    type: "setViewed",
    fingerprints: ["b2"],
    viewed: true,
  });

  // Verify
  const hasBothFingerprints = (viewedFingerprints: string[]) =>
    viewedFingerprints.includes("a1") && viewedFingerprints.includes("b2");
  const snapshots = await Promise.all(
    [firstTabShareSession, secondTabShareSession].map((shareSession) =>
      waitForShareSession(
        shareSession,
        (snapshot) =>
          !snapshot.hasPendingChanges &&
          hasBothFingerprints(snapshot.ownState.viewedFingerprints),
      ),
    ),
  );
  expect(
    snapshots.map((snapshot) =>
      snapshot.ownState.viewedFingerprints.toSorted(),
    ),
  ).toEqual([
    ["a1", "b2"],
    ["a1", "b2"],
  ]);
});

it("shows the step another participant is on", async () => {
  // Setup SUT
  const { apiOrigin, shareId, shareKey } = await createTestShare();
  const aliceParticipantId = randomBase64Url(16);
  const aliceShareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId: aliceParticipantId,
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => aliceShareSession.close());
  const bobShareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => bobShareSession.close());
  await waitForShareSession(
    bobShareSession,
    (snapshot) => snapshot.connectionStatus === "connected",
  );

  // Exercise
  aliceShareSession.setPresence("sync-buckets");

  // Verify
  const bobSnapshot = await waitForShareSession(
    bobShareSession,
    (snapshot) => snapshot.otherPresences.size > 0,
  );
  expect([...bobSnapshot.otherPresences.values()]).toEqual([
    {
      participantId: aliceParticipantId,
      presence: { stepIdHash: hashString("sync-buckets") },
    },
  ]);
});

it("ends the session when the owner deletes the share", async () => {
  // Setup SUT
  const { apiOrigin, shareId, shareKey, ownerSecret } = await createTestShare();
  const shareSession = new ShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => shareSession.close());
  await waitForShareSession(
    shareSession,
    (snapshot) => snapshot.connectionStatus === "connected",
  );

  // Exercise
  await deleteShare(apiOrigin, shareId, ownerSecret);

  // Verify
  const snapshot = await waitForShareSession(
    shareSession,
    (shareSessionSnapshot) => shareSessionSnapshot.connectionStatus === "ended",
  );
  expect(snapshot.endReason).toBe("notFound");
});

it("ends the session of a share that doesn't exist", async () => {
  // Setup SUT
  const { apiOrigin, shareKey } = await createTestShare();

  // Exercise
  const shareSession = new ShareSession({
    apiOrigin,
    shareId: randomBase64Url(16),
    shareKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => shareSession.close());

  // Verify
  const snapshot = await waitForShareSession(
    shareSession,
    (shareSessionSnapshot) => shareSessionSnapshot.connectionStatus === "ended",
  );
  expect(snapshot.endReason).toBe("notFound");
});
