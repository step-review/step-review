import { expect, it, onTestFinished } from "vitest";
import createTestSession from "../../test-utils/createTestSession.ts";
import waitForSessionConnection from "../../test-utils/waitForSessionConnection.ts";
import hashString from "../review/hashString.ts";
import randomBase64Url from "../session-crypto/randomBase64Url.ts";
import deleteSession from "../session/deleteSession.ts";
import SessionConnection from "./SessionConnection.ts";
import type SessionConnectionSnapshot from "./SessionConnectionSnapshot.ts";

it("shows a participant's stored state to the others", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey } = await createTestSession();
  const aliceParticipantId = randomBase64Url(16);
  const aliceSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: aliceParticipantId,
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => aliceSessionConnection.close());
  aliceSessionConnection.rename("Alice");
  aliceSessionConnection.dispatch({
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });
  await waitForSessionConnection(
    aliceSessionConnection,
    (snapshot) =>
      snapshot.connectionStatus === "connected" && !snapshot.hasPendingChanges,
  );

  // Exercise
  const bobSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => bobSessionConnection.close());

  // Verify
  const bobSnapshot = await waitForSessionConnection(
    bobSessionConnection,
    (snapshot) => snapshot.connectionStatus === "connected",
  );
  expect(bobSnapshot.otherParticipantStates).toEqual(
    new Map([
      [
        aliceParticipantId,
        {
          name: "Alice",
          viewedMarks: [
            {
              fingerprint: "a1",
              viewed: true,
              at: expect.any(Number) as number,
            },
          ],
        },
      ],
    ]),
  );
});

it("marks a file as not viewed for everyone when another participant marks it so", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey } = await createTestSession();
  const aliceSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => aliceSessionConnection.close());
  const bobSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => bobSessionConnection.close());
  aliceSessionConnection.dispatch({
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });
  await waitForSessionConnection(
    bobSessionConnection,
    (snapshot) => snapshot.fileViewedStatuses.get("a1")?.viewed === true,
  );

  // Exercise
  bobSessionConnection.dispatch({
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: false,
  });

  // Verify
  const aliceSnapshot = await waitForSessionConnection(
    aliceSessionConnection,
    (snapshot) => snapshot.fileViewedStatuses.get("a1")?.viewed === false,
  );
  expect(aliceSnapshot.fileViewedStatuses.get("a1")?.viewerIds).toEqual([]);
});

it("tells that a participant is new until they change their state", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey } = await createTestSession();

  // Exercise
  const sessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => sessionConnection.close());

  // Verify
  const snapshot = await waitForSessionConnection(
    sessionConnection,
    (sessionConnectionSnapshot) =>
      sessionConnectionSnapshot.connectionStatus === "connected",
  );
  expect(snapshot.isNewParticipant).toBe(true);
});

it("keeps the changes made at once in two tabs of the same participant", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey } = await createTestSession();
  const participant = {
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  };
  const firstTabSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    ...participant,
  });
  onTestFinished(() => firstTabSessionConnection.close());
  const secondTabSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    ...participant,
  });
  onTestFinished(() => secondTabSessionConnection.close());
  await Promise.all(
    [firstTabSessionConnection, secondTabSessionConnection].map(
      (sessionConnection) =>
        waitForSessionConnection(
          sessionConnection,
          (snapshot) => snapshot.connectionStatus === "connected",
        ),
    ),
  );

  // Exercise
  firstTabSessionConnection.dispatch({
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });
  secondTabSessionConnection.dispatch({
    type: "setViewed",
    fingerprints: ["b2"],
    viewed: true,
  });

  // Verify
  const markedFingerprints = (snapshot: SessionConnectionSnapshot) =>
    snapshot.ownState.viewedMarks
      .map((viewedMark) => viewedMark.fingerprint)
      .toSorted();
  const snapshots = await Promise.all(
    [firstTabSessionConnection, secondTabSessionConnection].map(
      (sessionConnection) =>
        waitForSessionConnection(
          sessionConnection,
          (snapshot) =>
            !snapshot.hasPendingChanges &&
            markedFingerprints(snapshot).length === 2,
        ),
    ),
  );
  expect(snapshots.map(markedFingerprints)).toEqual([
    ["a1", "b2"],
    ["a1", "b2"],
  ]);
});

it("shows the step and file another participant is on", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey } = await createTestSession();
  const aliceParticipantId = randomBase64Url(16);
  const aliceSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: aliceParticipantId,
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => aliceSessionConnection.close());
  const bobSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => bobSessionConnection.close());
  await waitForSessionConnection(
    bobSessionConnection,
    (snapshot) => snapshot.connectionStatus === "connected",
  );

  // Exercise
  aliceSessionConnection.setPresence({
    stepId: "sync-buckets",
    fileId: "sync-buckets:src/buckets.ts",
  });

  // Verify
  const bobSnapshot = await waitForSessionConnection(
    bobSessionConnection,
    (snapshot) => snapshot.otherPresences.size > 0,
  );
  expect([...bobSnapshot.otherPresences.values()]).toEqual([
    {
      participantId: aliceParticipantId,
      presence: {
        stepIdHash: hashString("sync-buckets"),
        fileIdHash: hashString("sync-buckets:src/buckets.ts"),
      },
    },
  ]);
});

it("sends only the first and the last of presences set in quick succession", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey } = await createTestSession();
  const aliceSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => aliceSessionConnection.close());
  const bobSessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => bobSessionConnection.close());
  await Promise.all(
    [aliceSessionConnection, bobSessionConnection].map((sessionConnection) =>
      waitForSessionConnection(
        sessionConnection,
        (snapshot) => snapshot.connectionStatus === "connected",
      ),
    ),
  );
  // Joining sent a presence: lets its interval pass.
  await new Promise((resolve) => setTimeout(resolve, 600));
  const receivedFileIdHashes: (string | null)[] = [];
  const unsubscribe = bobSessionConnection.subscribe(() => {
    const [alicePresence] = bobSessionConnection.getSnapshot().otherPresences;
    const fileIdHash = alicePresence?.[1].presence.fileIdHash;
    if (
      fileIdHash !== undefined &&
      receivedFileIdHashes.at(-1) !== fileIdHash
    ) {
      receivedFileIdHashes.push(fileIdHash);
    }
  });
  onTestFinished(() => {
    unsubscribe();
  });

  // Exercise
  for (const path of ["src/a.ts", "src/b.ts", "src/c.ts"]) {
    aliceSessionConnection.setPresence({
      stepId: "sync-buckets",
      fileId: `sync-buckets:${path}`,
    });
  }

  // Verify
  await waitForSessionConnection(
    bobSessionConnection,
    (snapshot) =>
      [...snapshot.otherPresences.values()][0]?.presence.fileIdHash ===
      hashString("sync-buckets:src/c.ts"),
  );
  expect(receivedFileIdHashes).toEqual([
    hashString("sync-buckets:src/a.ts"),
    hashString("sync-buckets:src/c.ts"),
  ]);
});

it("ends the connection when the owner deletes the session", async () => {
  // Setup SUT
  const { apiOrigin, sessionId, sessionKey, ownerSecret } =
    await createTestSession();
  const sessionConnection = new SessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => sessionConnection.close());
  await waitForSessionConnection(
    sessionConnection,
    (snapshot) => snapshot.connectionStatus === "connected",
  );

  // Exercise
  await deleteSession(apiOrigin, sessionId, ownerSecret);

  // Verify
  const snapshot = await waitForSessionConnection(
    sessionConnection,
    (sessionConnectionSnapshot) =>
      sessionConnectionSnapshot.connectionStatus === "ended",
  );
  expect(snapshot.endReason).toBe("notFound");
});

it("ends the connection to a session that doesn't exist", async () => {
  // Setup SUT
  const { apiOrigin, sessionKey } = await createTestSession();

  // Exercise
  const sessionConnection = new SessionConnection({
    apiOrigin,
    sessionId: randomBase64Url(16),
    sessionKey,
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
  });
  onTestFinished(() => sessionConnection.close());

  // Verify
  const snapshot = await waitForSessionConnection(
    sessionConnection,
    (sessionConnectionSnapshot) =>
      sessionConnectionSnapshot.connectionStatus === "ended",
  );
  expect(snapshot.endReason).toBe("notFound");
});
