import { expect, it } from "vitest";
import currentOwnState from "./currentOwnState.ts";
import nextOwnStateWrite from "./nextOwnStateWrite.ts";
import reduceOwnStateSync from "./reduceOwnStateSync.ts";

it("applies a dispatched action to the stored state right away", () => {
  // Setup SUT
  const ownStateSync = {
    revision: 3,
    storedState: { name: "Ada", viewedMarks: [] },
    pendingActions: [],
    inFlightWrite: null,
  };

  // Exercise
  const dispatchedOwnStateSync = reduceOwnStateSync(ownStateSync, {
    type: "actionDispatched",
    action: { type: "rename", name: "Ada L." },
  });

  // Verify
  expect(currentOwnState(dispatchedOwnStateSync)).toEqual({
    name: "Ada L.",
    viewedMarks: [],
  });
});

it("writes the changes based on the stored revision", () => {
  // Setup SUT
  const ownStateSync = {
    revision: 3,
    storedState: { name: "Ada", viewedMarks: [] },
    pendingActions: [{ type: "rename", name: "Ada L." } as const],
    inFlightWrite: null,
  };

  // Exercise
  const write = nextOwnStateWrite(ownStateSync);

  // Verify
  expect(write).toEqual({
    revision: 3,
    participantState: { name: "Ada L.", viewedMarks: [] },
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
      participantState: { name: "Ada", viewedMarks: [] },
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
      participantState: { name: "Ada", viewedMarks: [] },
    },
  );
  const dispatchedOwnStateSync = reduceOwnStateSync(sentOwnStateSync, {
    type: "actionDispatched",
    action: {
      type: "addViewedMarks",
      viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
    },
  });

  // Exercise
  const storedOwnStateSync = reduceOwnStateSync(dispatchedOwnStateSync, {
    type: "writeStored",
    revision: 1,
  });

  // Verify
  expect(storedOwnStateSync).toEqual({
    revision: 1,
    storedState: { name: "Ada", viewedMarks: [] },
    pendingActions: [
      {
        type: "addViewedMarks",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
      },
    ],
    inFlightWrite: null,
  });
});

it("applies the pending actions again to the newer state when a write is rejected", () => {
  // Setup SUT
  const sentOwnStateSync = reduceOwnStateSync(
    {
      revision: 1,
      storedState: { name: "Ada", viewedMarks: [] },
      pendingActions: [
        {
          type: "addViewedMarks",
          viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
        },
      ],
      inFlightWrite: null,
    },
    {
      type: "writeSent",
      participantState: {
        name: "Ada",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
      },
    },
  );

  // Exercise
  const rejectedOwnStateSync = reduceOwnStateSync(sentOwnStateSync, {
    type: "writeRejected",
    revision: 2,
    storedState: {
      name: "Ada",
      viewedMarks: [{ fingerprint: "b2", viewed: true, at: 900 }],
    },
  });

  // Verify
  expect(nextOwnStateWrite(rejectedOwnStateSync)).toEqual({
    revision: 2,
    participantState: {
      name: "Ada",
      viewedMarks: [
        { fingerprint: "b2", viewed: true, at: 900 },
        { fingerprint: "a1", viewed: true, at: 1000 },
      ],
    },
  });
});

it("ignores a received state older than the stored one", () => {
  // Setup SUT
  const ownStateSync = {
    revision: 4,
    storedState: {
      name: "Ada",
      viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
    },
    pendingActions: [],
    inFlightWrite: null,
  };

  // Exercise
  const receivedOwnStateSync = reduceOwnStateSync(ownStateSync, {
    type: "stateReceived",
    revision: 3,
    storedState: { name: "Ada", viewedMarks: [] },
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
      participantState: { name: "Ada", viewedMarks: [] },
    },
  );

  // Exercise
  const disconnectedOwnStateSync = reduceOwnStateSync(sentOwnStateSync, {
    type: "disconnected",
  });

  // Verify
  expect(nextOwnStateWrite(disconnectedOwnStateSync)).toEqual({
    revision: 0,
    participantState: { name: "Ada", viewedMarks: [] },
  });
});
