import type { FileDiff, ReviewData } from "@step-review/review-format";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import type SessionConnection from "../../../business-logic/session-connection/SessionConnection.ts";
import SessionConnectionProvider from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import type SessionConnectionSnapshot from "../../../business-logic/session-connection/SessionConnectionSnapshot.ts";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import CollaborationSessionDialogProvider from "./CollaborationSessionDialogProvider.tsx";
import SessionDetailsDialog from "./SessionDetailsDialog.tsx";

it("shows the own name once it is received after the dialog opens", async () => {
  // Setup SUT
  const sessionBookmark = {
    sessionId: "session-1",
    sessionKey: "session-key",
    title: "Review",
    openedAt: 0,
    participantId: "participant-1",
    participantSecret: "participant-secret",
    ownerSecret: "owner-secret",
  };
  const reviewView = {
    reviewAddress: {
      kind: "session",
      sessionId: "session-1",
      sessionKey: "session-key",
    } as const,
    data: {} as ReviewData,
    diff: [] as FileDiff[],
    steps: [],
  };
  const renderDialog = (
    sessionConnectionSnapshot: SessionConnectionSnapshot,
  ) => (
    <CollaborationSessionDialogProvider>
      <ReviewViewProvider reviewView={reviewView}>
        <SessionConnectionProvider
          value={{
            sessionBookmark,
            sessionConnection: {} as SessionConnection,
            sessionConnectionSnapshot,
          }}
        >
          <SessionDetailsDialog />
        </SessionConnectionProvider>
      </ReviewViewProvider>
    </CollaborationSessionDialogProvider>
  );
  const screen = await render(
    renderDialog({
      connectionStatus: "connecting",
      endReason: null,
      ownState: { name: "", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map(),
      fileViewedStatuses: new Map(),
      otherPresences: new Map(),
    }),
    { wrapper: TestProviders },
  );

  // Exercise
  await screen.rerender(
    renderDialog({
      connectionStatus: "connected",
      endReason: null,
      ownState: { name: "Ada", viewedMarks: [] },
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map(),
      fileViewedStatuses: new Map(),
      otherPresences: new Map(),
    }),
  );

  // Verify
  await expect
    .element(screen.getByRole("textbox", { name: "Your name" }))
    .toHaveValue("Ada");
});
