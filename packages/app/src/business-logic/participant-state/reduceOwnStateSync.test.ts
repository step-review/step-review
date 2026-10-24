import { expect, it } from "vitest";
import currentOwnState from "./currentOwnState.ts";
import nextOwnStateWrite from "./nextOwnStateWrite.ts";
import reduceOwnStateSync from "./reduceOwnStateSync.ts";

it("applies a dispatched action to the stored state right away", () => {
  // Setup SUT
  const ownStateSync = {
    revision: 3,
    storedState: { name: "Ada", viewedFingerprints: ["a1"] },
    pendingActions: [],
    inFlightWrite: null,
  };

  // Exercise
  const dispatchedOwnStateSync = reduceOwnStateSync(ownStateSync, {
    type: "actionDispatched",
    action: { type: "setViewed", fingerprints: ["b2"], viewed: true },
  });

  // Verify
  expect(currentOwnState(dispatchedOwnStateSync)).toEqual({
    name: "Ada",
    viewedFingerprints: ["a1", "b2"],
  });
});

it("writes the changes based on the stored revision", () => {
  // Setup SUT
  const ownStateSync = {
    revision: 3,
    storedState: { name: "Ada", viewedFingerprints: [] },
    pendingActions: [{ type: "rename", name: "Ada L." } as const],
    inFlightWrite: null,
  };

  // Exercise
  const write = nextOwnStateWrite(ownStateSync);

  // Verify
  expect(write).toEqual({
    revision: 3,
    participantState: { name: "Ada L.", viewedFingerprints: [] },
  });
});

it("doesn't write again while a write is in flight", () => {
  // Setup SUT
  const ownStateSync = reduceOwnStateSync(
    {
      revision: 0,
      storedState: null,
      pendingActions: [{ type: "rename", name: "Ada" }],
      inFlightWrite: null,
    },
    {
      type: "writeSent",
      participantState: { name: "Ada", viewedFingerprints: [] },
    },
  );

  // Exercise
  const write = nextOwnStateWrite(ownStateSync);

  // Verify
  expect(write).toBeNull();
});

it("keeps the actions dispatched during a write pending once it is stored", () => {
  // Setup SUT
  const sentOwnStateSync = reduceOwnStateSync(
    {
      revision: 0,
      storedState: null,
      pendingActions: [{ type: "rename", name: "Ada" }],
      inFlightWrite: null,
    },
    {
      type: "writeSent",
      participantState: { name: "Ada", viewedFingerprints: [] },
    },
  );
  const dispatchedOwnStateSync = reduceOwnStateSync(sentOwnStateSync, {
    type: "actionDispatched",
    action: { type: "setViewed", fingerprints: ["a1"], viewed: true },
  });

  // Exercise
  const storedOwnStateSync = reduceOwnStateSync(dispatchedOwnStateSync, {
    type: "writeStored",
    revision: 1,
  });

  // Verify
  expect(storedOwnStateSync).toEqual({
    revision: 1,
    storedState: { name: "Ada", viewedFingerprints: [] },
    pendingActions: [{ type: "setViewed", fingerprints: ["a1"], viewed: true }],
    inFlightWrite: null,
  });
});

it("applies the pending actions again to the newer state when a write is rejected", () => {
  // Setup SUT
  const sentOwnStateSync = reduceOwnStateSync(
    {
      revision: 1,
      storedState: { name: "Ada", viewedFingerprints: [] },
      pendingActions: [
        { type: "setViewed", fingerprints: ["a1"], viewed: true },
      ],
      inFlightWrite: null,
    },
    {
      type: "writeSent",
      participantState: { name: "Ada", viewedFingerprints: ["a1"] },
    },
  );

  // Exercise
  const rejectedOwnStateSync = reduceOwnStateSync(sentOwnStateSync, {
    type: "writeRejected",
    revision: 2,
    storedState: { name: "Ada", viewedFingerprints: ["b2"] },
  });

  // Verify
  expect(nextOwnStateWrite(rejectedOwnStateSync)).toEqual({
    revision: 2,
    participantState: { name: "Ada", viewedFingerprints: ["b2", "a1"] },
  });
});

it("ignores a received state older than the stored one", () => {
  // Setup SUT
  const ownStateSync = {
    revision: 4,
    storedState: { name: "Ada", viewedFingerprints: ["a1"] },
    pendingActions: [],
    inFlightWrite: null,
  };

  // Exercise
  const receivedOwnStateSync = reduceOwnStateSync(ownStateSync, {
    type: "stateReceived",
    revision: 3,
    storedState: { name: "Ada", viewedFingerprints: [] },
  });

  // Verify
  expect(receivedOwnStateSync).toBe(ownStateSync);
});

it("sends the pending actions again after disconnecting during a write", () => {
  // Setup SUT
  const sentOwnStateSync = reduceOwnStateSync(
    {
      revision: 0,
      storedState: null,
      pendingActions: [{ type: "rename", name: "Ada" }],
      inFlightWrite: null,
    },
    {
      type: "writeSent",
      participantState: { name: "Ada", viewedFingerprints: [] },
    },
  );

  // Exercise
  const disconnectedOwnStateSync = reduceOwnStateSync(sentOwnStateSync, {
    type: "disconnected",
  });

  // Verify
  expect(nextOwnStateWrite(disconnectedOwnStateSync)).toEqual({
    revision: 0,
    participantState: { name: "Ada", viewedFingerprints: [] },
  });
});
