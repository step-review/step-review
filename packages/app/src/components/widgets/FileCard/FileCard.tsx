import { Alert, Button, Paper, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import useFragment from "../../../business-logic/navigation/useFragment.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import githubFileUrl from "../../../business-logic/review-view/githubFileUrl.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import splitFileNotes from "../../../business-logic/review-view/splitFileNotes.ts";
import type StepFileView from "../../../business-logic/review-view/StepFileView.ts";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import DiffView from "../DiffView/DiffView.tsx";
import FileCardHeader from "../FileCardHeader/FileCardHeader.tsx";
import NoteCard from "../NoteCard/NoteCard.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import styles from "./FileCard.module.css";

interface Props {
  stepView: StepView;
  stepFileView: StepFileView;
  layout: "unified" | "split";
  areExplainersHidden: boolean;
}

export default function FileCard({
  stepView,
  stepFileView,
  layout,
  areExplainersHidden,
}: Props) {
  const reviewView = useCurrentReviewView();
  const { dispatch } = useReviewState();
  const isViewed = useViewedFingerprints().has(stepFileView.fingerprint);
  const [isCollapsed, setIsCollapsed] = useState(
    isViewed || stepView.attention === "low",
  );
  const [isSummaryDiffShown, setIsSummaryDiffShown] = useState(false);
  const fragment = useFragment();
  const isTargeted =
    fragment === `file-${stepFileView.id}` ||
    stepFileView.notes.some((note) => fragment === `note-${note.id}`);
  useEffect(() => {
    if (isViewed) {
      setIsCollapsed(true);
    }
  }, [isViewed]);
  useEffect(() => {
    if (isTargeted) {
      setIsCollapsed(false);
    }
  }, [isTargeted]);
  const { hunks } = stepFileView;
  const visibleNotes = stepFileView.notes.filter(
    (note) => !areExplainersHidden || note.kind === "issue",
  );
  const { lineNotes, fileNotes } = splitFileNotes(visibleNotes, hunks);
  const cardRef = useRef<HTMLDivElement>(null);
  const setViewed = (viewed: boolean) => {
    dispatch({
      type: "setViewed",
      fingerprints: [stepFileView.fingerprint],
      viewed,
    });
    setIsCollapsed(viewed);
    // Collapsing a long diff scrolled past would jump to an unrelated file.
    if (viewed && (cardRef.current?.getBoundingClientRect().top ?? 0) < 0) {
      cardRef.current?.scrollIntoView({ block: "start" });
    }
  };
  const showDiff = !stepFileView.summary || isSummaryDiffShown;
  return (
    <Paper
      ref={cardRef}
      withBorder
      id={`file-${stepFileView.id}`}
      className={styles["card"]}
    >
      <FileCardHeader
        stepFileView={stepFileView}
        githubUrl={githubFileUrl(reviewView.data.target, stepFileView.path)}
        isCollapsed={isCollapsed}
        isViewed={isViewed}
        onToggleCollapsed={() => setIsCollapsed((collapsed) => !collapsed)}
        onViewedChange={setViewed}
      />
      {!isCollapsed && (
        <Stack gap="xs" className={styles["body"]}>
          {fileNotes.length > 0 && (
            <Stack gap={6} px="xs" pt="xs" maw={760}>
              {fileNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </Stack>
          )}
          {stepFileView.summary && (
            <Alert
              color="gray"
              mx="xs"
              title={
                <FormattedMessage defaultMessage="Summary instead of the diff" />
              }
            >
              <ReviewMarkdown>{stepFileView.summary}</ReviewMarkdown>
              <Button
                size="compact-xs"
                variant="subtle"
                mt="xs"
                onClick={() => setIsSummaryDiffShown((shown) => !shown)}
              >
                {isSummaryDiffShown ? (
                  <FormattedMessage defaultMessage="Hide the diff" />
                ) : (
                  <FormattedMessage defaultMessage="Show the diff" />
                )}
              </Button>
            </Alert>
          )}
          {showDiff && stepFileView.fileDiff.binary && (
            <Text size="sm" c="dimmed" px="xs" pb="xs">
              <FormattedMessage defaultMessage="Binary file: no diff to show." />
            </Text>
          )}
          {showDiff && !stepFileView.fileDiff.binary && hunks.length === 0 && (
            <Text size="sm" c="dimmed" px="xs" pb="xs">
              <FormattedMessage defaultMessage="No content changes." />
            </Text>
          )}
          {showDiff && hunks.length > 0 && (
            <DiffView
              path={stepFileView.path}
              hunks={hunks}
              notes={lineNotes}
              layout={layout}
            />
          )}
        </Stack>
      )}
    </Paper>
  );
}
