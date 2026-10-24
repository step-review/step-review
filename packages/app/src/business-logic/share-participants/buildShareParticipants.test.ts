import { expect, it } from "vitest";
import type StepView from "../review-view/StepView.ts";
import hashString from "../review/hashString.ts";
import buildShareParticipants from "./buildShareParticipants.ts";

it("places another participant on the step their presence names", () => {
  // Setup SUT
  const steps = [{ id: "sync-buckets" }, { id: "retry-uploads" }] as StepView[];

  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedFingerprints: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedFingerprints: ["a1"] }],
      ]),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: { stepIdHash: hashString("retry-uploads") },
          },
        ],
      ]),
    },
    "ada",
    steps,
  );

  // Verify
  expect(shareParticipants[1]).toMatchObject({
    participantId: "bob",
    isOnline: true,
    stepIds: ["retry-uploads"],
  });
});

it("lists the own participant first, then those online, then the others by name", () => {
  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Zoe", viewedFingerprints: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["cleo", { name: "Cleo", viewedFingerprints: [] }],
        ["bob", { name: "Bob", viewedFingerprints: [] }],
        ["dan", { name: "Dan", viewedFingerprints: [] }],
      ]),
      otherPresences: new Map([
        ["dan-tab", { participantId: "dan", presence: { stepIdHash: null } }],
      ]),
    },
    "zoe",
    [],
  );

  // Verify
  expect(shareParticipants.map((participant) => participant.name)).toEqual([
    "Zoe",
    "Dan",
    "Bob",
    "Cleo",
  ]);
});

it("keeps a participant online on a step that isn't in the review", () => {
  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedFingerprints: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedFingerprints: [] }],
      ]),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: { stepIdHash: hashString("removed-step") },
          },
        ],
      ]),
    },
    "ada",
    [{ id: "sync-buckets" }] as StepView[],
  );

  // Verify
  expect(shareParticipants[1]).toMatchObject({ isOnline: true, stepIds: [] });
});
