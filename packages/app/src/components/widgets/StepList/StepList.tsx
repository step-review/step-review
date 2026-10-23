import {
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import styles from "./StepList.module.css";

export default function StepList() {
  const reviewView = useCurrentReviewView();
  const viewedFingerprints = useViewedFingerprints();
  return (
    <Stack gap="xs">
      {reviewView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        return (
          <Paper key={step.id} withBorder p="sm" className={styles["step"]}>
            <UnstyledButton
              className={styles["title"]}
              onClick={() =>
                navigateTo({ name: RouteName.Step, stepId: step.id })
              }
            >
              <Group gap="xs">
                <Text fw={700}>
                  {step.number}. <StepTitle step={step} />
                </Text>
                <AttentionBadge attention={step.attention} />
                <Text size="xs" c="dimmed" ml="auto">
                  <FormattedMessage
                    defaultMessage="{viewedCount} / {totalCount} viewed"
                    values={progress}
                  />
                </Text>
              </Group>
            </UnstyledButton>
            <Progress
              size={3}
              my={6}
              value={
                (progress.viewedCount / Math.max(progress.totalCount, 1)) * 100
              }
              color={
                progress.viewedCount === progress.totalCount
                  ? "success"
                  : "brand"
              }
            />
            {step.intro && <ReviewMarkdown>{step.intro}</ReviewMarkdown>}
          </Paper>
        );
      })}
    </Stack>
  );
}
