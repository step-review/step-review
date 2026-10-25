import { expect, it } from "vitest";
import sessionApiPaths from "../protocol/sessionApiPaths.ts";
import sessionCloseCodes from "../protocol/sessionCloseCodes.ts";
import type SessionInfo from "../protocol/SessionInfo.ts";
import putTestReview from "../test-utils/putTestReview.ts";
import randomTestId from "../test-utils/randomTestId.ts";
import sessionServerFetch from "../test-utils/sessionServerFetch.ts";
import TestSessionSocket from "../test-utils/TestSessionSocket.ts";

it("sends the review version and the written states on joining", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  const response = await putTestReview(
    sessionId,
    randomTestId(32),
    new Uint8Array([1]),
  );
  const { versionId } = (await response.json()) as SessionInfo;
  const writingSocket = await TestSessionSocket.open(sessionId);
  const writingParticipantId = randomTestId();
  writingSocket.send({
    type: "join",
    participantId: writingParticipantId,
    participantSecret: randomTestId(32),
  });
  await writingSocket.nextMessage();
  writingSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });
  await writingSocket.nextMessage();
  const joiningSocket = await TestSessionSocket.open(sessionId);

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
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const writingSocket = await TestSessionSocket.open(sessionId);
  const writingParticipantId = randomTestId();
  writingSocket.send({
    type: "join",
    participantId: writingParticipantId,
    participantSecret: randomTestId(32),
  });
  await writingSocket.nextMessage();
  const otherSocket = await TestSessionSocket.open(sessionId);
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
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const sessionSocket = await TestSessionSocket.open(sessionId);
  sessionSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await sessionSocket.nextMessage();
  sessionSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });
  await sessionSocket.nextMessage();

  // Exercise
  sessionSocket.send({ type: "writeState", revision: 0, state: "alice-v2" });

  // Verify
  expect(await sessionSocket.nextMessage()).toEqual({
    type: "stateRejected",
    revision: 1,
    state: "alice-v1",
  });
});

it("relays a presence to the others, and its end when the socket closes", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const movingSocket = await TestSessionSocket.open(sessionId);
  const movingParticipantId = randomTestId();
  movingSocket.send({
    type: "join",
    participantId: movingParticipantId,
    participantSecret: randomTestId(32),
  });
  const joinedMessage = await movingSocket.nextMessage();
  const otherSocket = await TestSessionSocket.open(sessionId);
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
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const presentSocket = await TestSessionSocket.open(sessionId);
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
  const joiningSocket = await TestSessionSocket.open(sessionId);

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
  const sessionId = randomTestId();
  const ownerSecret = randomTestId(32);
  await putTestReview(sessionId, ownerSecret, new Uint8Array([1]));
  const sessionSocket = await TestSessionSocket.open(sessionId);
  sessionSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await sessionSocket.nextMessage();

  // Exercise
  const response = await putTestReview(
    sessionId,
    ownerSecret,
    new Uint8Array([2]),
  );

  // Verify
  const { versionId } = (await response.json()) as SessionInfo;
  expect(await sessionSocket.nextMessage()).toEqual({
    type: "reviewVersion",
    versionId,
  });
});

it("closes the socket of a participant joining with the wrong secret", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const participantId = randomTestId();
  const firstSocket = await TestSessionSocket.open(sessionId);
  firstSocket.send({
    type: "join",
    participantId,
    participantSecret: randomTestId(32),
  });
  await firstSocket.nextMessage();
  const impostorSocket = await TestSessionSocket.open(sessionId);

  // Exercise
  impostorSocket.send({
    type: "join",
    participantId,
    participantSecret: randomTestId(32),
  });

  // Verify
  expect(await impostorSocket.closed).toBe(sessionCloseCodes.forbidden);
});

it("closes a socket that writes a state before joining", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const sessionSocket = await TestSessionSocket.open(sessionId);

  // Exercise
  sessionSocket.send({ type: "writeState", revision: 0, state: "alice-v1" });

  // Verify
  expect(await sessionSocket.closed).toBe(sessionCloseCodes.invalidMessage);
});

it("closes a socket that sends a malformed message", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));
  const sessionSocket = await TestSessionSocket.open(sessionId);

  // Exercise
  sessionSocket.send("not json");

  // Verify
  expect(await sessionSocket.closed).toBe(sessionCloseCodes.invalidMessage);
});

it("closes the sockets when the owner deletes the session", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  const ownerSecret = randomTestId(32);
  await putTestReview(sessionId, ownerSecret, new Uint8Array([1]));
  const sessionSocket = await TestSessionSocket.open(sessionId);
  sessionSocket.send({
    type: "join",
    participantId: randomTestId(),
    participantSecret: randomTestId(32),
  });
  await sessionSocket.nextMessage();

  // Exercise
  await sessionServerFetch(sessionApiPaths.session(sessionId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ownerSecret}` },
  });

  // Verify
  expect(await sessionSocket.closed).toBe(sessionCloseCodes.sessionNotFound);
});

it("refuses to open a socket for a session that doesn't exist", async () => {
  // Exercise and verify
  await expect(TestSessionSocket.open(randomTestId())).rejects.toBeDefined();
});
