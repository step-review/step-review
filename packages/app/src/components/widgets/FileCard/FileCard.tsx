import {
  Alert,
  Button,
  Paper,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useFragment from "../../../business-logic/navigation/useFragment.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import githubFileUrl from "../../../business-logic/rounds/githubFileUrl.ts";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import splitFileNotes from "../../../business-logic/rounds/splitFileNotes.ts";
import type StepFileView from "../../../business-logic/rounds/StepFileView.ts";
import type StepView from "../../../business-logic/rounds/StepView.ts";
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
  const intl = useIntl();
  const roundView = useCurrentRoundView();
  const { dispatch } = useReviewState();
  const isViewed = useViewedFingerprints().has(stepFileView.fingerprint);
  const [isCollapsed, setIsCollapsed] = useState(
    isViewed || stepView.attention === "low",
  );
  const [diffRange, setDiffRange] = useState<"pr" | "previousRound">("pr");
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
  const isSincePreviousRound =
    diffRange === "previousRound" && stepFileView.interdiffHunks !== null;
  const hunks = isSincePreviousRound
    ? stepFileView.interdiffHunks!
    : stepFileView.hunks;
  const visibleNotes = stepFileView.notes.filter(
    (note) => !areExplainersHidden || note.kind === "issue",
  );
  const { lineNotes, fileNotes } = splitFileNotes(
    visibleNotes,
    isSincePreviousRound ? [] : hunks,
  );
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
        previousRoundNumber={roundView.previousRound?.number ?? null}
        githubUrl={githubFileUrl(
          roundView.round.data.target,
          stepFileView.path,
        )}
        isCollapsed={isCollapsed}
        isViewed={isViewed}
        onToggleCollapsed={() => setIsCollapsed((collapsed) => !collapsed)}
        onViewedChange={setViewed}
      />
      {!isCollapsed && (
        <Stack gap="xs" className={styles["body"]}>
          {fileNotes.length > 0 && (
            <Stack gap={6} p="xs" pb={0} maw={760}>
              {fileNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </Stack>
          )}
          {stepFileView.interdiffHunks && (
            <SegmentedControl
              size="xs"
              ml="xs"
              className={styles["rangeControl"]}
              value={diffRange}
              onChange={(value) => setDiffRange(value)}
              data={[
                {
                  value: "pr",
                  label: intl.formatMessage({ defaultMessage: "Whole PR" }),
                },
                {
                  value: "previousRound",
                  label: intl.formatMessage(
                    { defaultMessage: "Since round {roundNumber}" },
                    { roundNumber: roundView.previousRound?.number ?? 0 },
                  ),
                },
              ]}
            />
          )}
          {isSincePreviousRound && (
            <Text size="xs" c="dimmed" px="xs">
              <FormattedMessage defaultMessage="Only the changes since the previous round. Line notes are on the whole-PR diff." />
            </Text>
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
