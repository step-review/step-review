import { Heading, Stack } from "@primer/react";
import { FormattedMessage } from "react-intl";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
import NoteCard from "../NoteCard/NoteCard.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import styles from "./StepHeader.module.css";

interface Props {
  stepView: StepView;
  stepCount: number;
  areExplainersHidden: boolean;
}

export default function StepHeader({
  stepView,
  stepCount,
  areExplainersHidden,
}: Props) {
  return (
    <Stack gap="condensed" className={styles["header"]}>
      <div className={styles["eyebrow"]}>
        <span className={styles["position"]}>
          <FormattedMessage
            defaultMessage="Step {stepNumber} of {stepCount}"
            values={{ stepNumber: stepView.number, stepCount }}
          />
        </span>
        <AttentionBadge attention={stepView.attention} />
      </div>
      <Heading as="h1" variant="large" className={styles["title"]}>
        <StepTitle step={stepView} />
      </Heading>
      {stepView.intro ? (
        <ReviewMarkdown size="large">{stepView.intro}</ReviewMarkdown>
      ) : (
        <p className={styles["noIntro"]}>
          <FormattedMessage defaultMessage="These files changed in the PR, but the review doesn't assign them to a step." />
        </p>
      )}
      {stepView.notes
        .filter((note) => !areExplainersHidden || note.kind === "issue")
        .map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
    </Stack>
  );
}
