import { expect, it } from "vitest";
import shareApiPaths from "../protocol/shareApiPaths.ts";
import shareCloseCodes from "../protocol/shareCloseCodes.ts";
import type ShareInfo from "../protocol/ShareInfo.ts";
import putTestReview from "../test-utils/putTestReview.ts";
import randomTestId from "../test-utils/randomTestId.ts";
import shareServerFetch from "../test-utils/shareServerFetch.ts";
import TestShareSocket from "../test-utils/TestShareSocket.ts";

it("sends the review version and the written states on joining", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const response = await putTestReview(
    shareId,
    randomTestId(32),
    new Uint8Array([1]),
  );
  const { versionId } = (await response.json()) as ShareInfo;
  const writingSocket = await TestShareSocket.open(shareId);
  const writingParticipantId = randomTestId();
  writingSocket.send({
    type: "join",
    participantId: writingParticipantId,
    participantSecret: randomTestId(32),
  });
  await writingSocket.nextMessage();
  writingSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });
  await writingSocket.nextMessage();
  const joiningSocket = await TestShareSocket.open(shareId);

  // Exercise
  joiningSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });

  // Verify
  expect(await joiningSocket.nextMessage()).toMatchObject({
    type: "joined",
    versionId,
    participantStates: [
      { participantId: writingParticipantId, revision: 1, state: "alice-v1" },
    ],
    presences: [],
  });
});

it("writes a state based on its current revision and relays it to the others", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const writingSocket = await TestShareSocket.open(shareId);
  const writingParticipantId = randomTestId();
  writingSocket.send({
    type: "join",
    participantId: writingParticipantId,
    participantSecret: randomTestId(32),
  });
  await writingSocket.nextMessage();
  const otherSocket = await TestShareSocket.open(shareId);
  otherSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await otherSocket.nextMessage();

  // Exercise
  writingSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });

  // Verify
  expect(await writingSocket.nextMessage()).toEqual({
    type: "stateWritten",
    revision: 1,
  });
  expect(await otherSocket.nextMessage()).toEqual({
    type: "participantState",
    participantId: writingParticipantId,
    revision: 1,
    state: "alice-v1",
  });
});

it("rejects a state based on an old revision, with the current one", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const shareSocket = await TestShareSocket.open(shareId);
  shareSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await shareSocket.nextMessage();
  shareSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });
  await shareSocket.nextMessage();

  // Exercise
  shareSocket.send({ type: "writeState", revision: 0, state: "alice-v2" });

  // Verify
  expect(await shareSocket.nextMessage()).toEqual({
    type: "stateRejected",
    revision: 1,
    state: "alice-v1",
  });
});

it("relays a presence to the others, and its end when the socket closes", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const movingSocket = await TestShareSocket.open(shareId);
  const movingParticipantId = randomTestId();
  movingSocket.send({
    type: "join",
    participantId: movingParticipantId,
    participantSecret: randomTestId(32),
  });
  const joinedMessage = await movingSocket.nextMessage();
  const otherSocket = await TestShareSocket.open(shareId);
  otherSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await otherSocket.nextMessage();

  // Exercise
  movingSocket.send({ type: "setPresence", presence: "step-2" });
  const presenceMessage = await otherSocket.nextMessage();
  movingSocket.close();

  // Verify
  const connectionId =
    joinedMessage.type === "joined" ? joinedMessage.connectionId : null;
  expect(presenceMessage).toEqual({
    type: "presence",
    connectionId,
    participantId: movingParticipantId,
    presence: "step-2",
  });
  expect(await otherSocket.nextMessage()).toEqual({
    type: "presenceEnded",
    connectionId,
  });
});

it("sends the presences of the others on joining", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const presentSocket = await TestShareSocket.open(shareId);
  const presentParticipantId = randomTestId();
  presentSocket.send({
    type: "join",
    participantId: presentParticipantId,
    participantSecret: randomTestId(32),
  });
  const presentJoinedMessage = await presentSocket.nextMessage();
  const presentConnectionId =
    presentJoinedMessage.type === "joined"
      ? presentJoinedMessage.connectionId
      : null;
  presentSocket.send({ type: "setPresence", presence: "overview" });
  const joiningSocket = await TestShareSocket.open(shareId);

  // Exercise
  joiningSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });

  // Verify
  const joinedMessage = await joiningSocket.nextMessage();
  expect(joinedMessage.type === "joined" && joinedMessage.presences).toEqual([
    {
      connectionId: presentConnectionId,
      participantId: presentParticipantId,
      presence: "overview",
    },
  ]);
});

it("tells the joined sockets when the owner uploads a new version", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const ownerSecret = randomTestId(32);
  await putTestReview(shareId, ownerSecret, new Uint8Array([1]));
  const shareSocket = await TestShareSocket.open(shareId);
  shareSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await shareSocket.nextMessage();

  // Exercise
  const response = await putTestReview(
    shareId,
    ownerSecret,
    new Uint8Array([2]),
  );

  // Verify
  const { versionId } = (await response.json()) as ShareInfo;
  expect(await shareSocket.nextMessage()).toEqual({
    type: "reviewVersion",
    versionId,
  });
});

it("closes the socket of a participant joining with the wrong secret", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const participantId = randomTestId();
  const firstSocket = await TestShareSocket.open(shareId);
  firstSocket.send({
    type: "join",
    participantId,
    participantSecret: randomTestId(32),
  });
  await firstSocket.nextMessage();
  const impostorSocket = await TestShareSocket.open(shareId);

  // Exercise
  impostorSocket.send({
    type: "join",
    participantId,
    participantSecret: randomTestId(32),
  });

  // Verify
  expect(await impostorSocket.closed).toBe(shareCloseCodes.forbidden);
});

it("closes a socket that writes a state before joining", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const shareSocket = await TestShareSocket.open(shareId);

  // Exercise
  shareSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });

  // Verify
  expect(await shareSocket.closed).toBe(shareCloseCodes.invalidMessage);
});

it("closes a socket that sends a malformed message", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));
  const shareSocket = await TestShareSocket.open(shareId);

  // Exercise
  shareSocket.send("not json");

  // Verify
  expect(await shareSocket.closed).toBe(shareCloseCodes.invalidMessage);
});

it("closes the sockets when the owner deletes the share", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const ownerSecret = randomTestId(32);
  await putTestReview(shareId, ownerSecret, new Uint8Array([1]));
  const shareSocket = await TestShareSocket.open(shareId);
  shareSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await shareSocket.nextMessage();

  // Exercise
  await shareServerFetch(shareApiPaths.share(shareId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ownerSecret}` },
  });

  // Verify
  expect(await shareSocket.closed).toBe(shareCloseCodes.shareNotFound);
});

it("refuses to open a socket for a share that doesn't exist", async () => {
  // Exercise and verify
  await expect(TestShareSocket.open(randomTestId())).rejects.toBeDefined();
});
