import { expect, it } from "vitest";
import type StepView from "../review-view/StepView.ts";
import hashString from "../review/hashString.ts";
import buildShareParticipants from "./buildShareParticipants.ts";

it("places another participant on the step their presence names", () => {
  // Setup SUT
  const steps = [
    { id: "sync-buckets", files: [] },
    { id: "retry-uploads", files: [] },
  ] as unknown as StepView[];

  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("retry-uploads"),
              fileIdHash: null,
            },
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
    locations: [{ stepId: "retry-uploads", fileId: null }],
  });
});

it("lists the own participant first, then those online, then the others by name", () => {
  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Zoe", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["cleo", { name: "Cleo", viewedMarks: [] }],
        ["bob", { name: "Bob", viewedMarks: [] }],
        ["dan", { name: "Dan", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "dan-tab",
          {
            participantId: "dan",
            presence: { stepIdHash: null, fileIdHash: null },
          },
        ],
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
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("removed-step"),
              fileIdHash: null,
            },
          },
        ],
      ]),
    },
    "ada",
    [{ id: "sync-buckets", files: [] }] as unknown as StepView[],
  );

  // Verify
  expect(shareParticipants[1]).toMatchObject({ isOnline: true, locations: [] });
});

it("places another participant on the file their presence names", () => {
  // Setup SUT
  const steps = [
    {
      id: "sync-buckets",
      files: [
        { id: "sync-buckets:src/buckets.ts" },
        { id: "sync-buckets:src/sync.ts" },
      ],
    },
  ] as unknown as StepView[];

  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("sync-buckets"),
              fileIdHash: hashString("sync-buckets:src/sync.ts"),
            },
          },
        ],
      ]),
    },
    "ada",
    steps,
  );

  // Verify
  expect(shareParticipants[1]?.locations).toEqual([
    { stepId: "sync-buckets", fileId: "sync-buckets:src/sync.ts" },
  ]);
});

it("keeps another participant on their step when their file isn't in the review", () => {
  // Setup SUT
  const steps = [
    { id: "sync-buckets", files: [{ id: "sync-buckets:src/buckets.ts" }] },
  ] as unknown as StepView[];

  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("sync-buckets"),
              fileIdHash: hashString("sync-buckets:src/removed.ts"),
            },
          },
        ],
      ]),
    },
    "ada",
    steps,
  );

  // Verify
  expect(shareParticipants[1]).toMatchObject({
    isOnline: true,
    locations: [{ stepId: "sync-buckets", fileId: null }],
  });
});

it("doesn't place another participant on a file of another step than theirs", () => {
  // Setup SUT
  const steps = [
    { id: "sync-buckets", files: [{ id: "sync-buckets:src/buckets.ts" }] },
    { id: "retry-uploads", files: [{ id: "retry-uploads:src/upload.ts" }] },
  ] as unknown as StepView[];

  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "bob-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("sync-buckets"),
              fileIdHash: hashString("retry-uploads:src/upload.ts"),
            },
          },
        ],
      ]),
    },
    "ada",
    steps,
  );

  // Verify
  expect(shareParticipants[1]?.locations).toEqual([
    { stepId: "sync-buckets", fileId: null },
  ]);
});

it("shows once a place another participant has open in two tabs", () => {
  // Setup SUT
  const steps = [
    { id: "sync-buckets", files: [{ id: "sync-buckets:src/buckets.ts" }] },
  ] as unknown as StepView[];

  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map(),
      otherPresences: new Map([
        [
          "bob-first-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("sync-buckets"),
              fileIdHash: hashString("sync-buckets:src/buckets.ts"),
            },
          },
        ],
        [
          "bob-second-tab",
          {
            participantId: "bob",
            presence: {
              stepIdHash: hashString("sync-buckets"),
              fileIdHash: hashString("sync-buckets:src/buckets.ts"),
            },
          },
        ],
      ]),
    },
    "ada",
    steps,
  );

  // Verify
  expect(shareParticipants[1]?.locations).toEqual([
    { stepId: "sync-buckets", fileId: "sync-buckets:src/buckets.ts" },
  ]);
});

it("lists the files each participant viewed since they were last marked not viewed", () => {
  // Exercise
  const shareParticipants = buildShareParticipants(
    {
      connectionStatus: "connected",
      endReason: null,
      versionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map([
        ["bob", { name: "Bob", viewedMarks: [] }],
      ]),
      fileViewedStatuses: new Map([
        ["a1", { viewed: true, at: 1000, viewerIds: ["ada", "bob"] }],
        ["b2", { viewed: true, at: 2000, viewerIds: ["bob"] }],
      ]),
      otherPresences: new Map(),
    },
    "ada",
    [],
  );

  // Verify
  expect(
    shareParticipants.map((shareParticipant) => [
      shareParticipant.participantId,
      [...shareParticipant.viewedFingerprints],
    ]),
  ).toEqual([
    ["ada", ["a1"]],
    ["bob", ["a1", "b2"]],
  ]);
});
