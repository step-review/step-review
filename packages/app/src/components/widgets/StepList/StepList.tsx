import {
  Badge,
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
import countViewedFiles from "../../../business-logic/rounds/countViewedFiles.ts";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import styles from "./StepList.module.css";

export default function StepList() {
  const roundView = useCurrentRoundView();
  const viewedFingerprints = useViewedFingerprints();
  return (
    <Stack gap="xs">
      {roundView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        const changedCount = step.files.filter((file) => file.change).length;
        return (
          <Paper key={step.id} withBorder p="sm" className={styles["step"]}>
            <UnstyledButton
              className={styles["title"]}
              onClick={() =>
                navigateTo({
                  name: RouteName.Step,
                  roundNumber: roundView.round.number,
                  stepId: step.id,
                })
              }
            >
              <Group gap="xs">
                <Text fw={700}>
                  {step.number}. <StepTitle step={step} />
                </Text>
                <AttentionBadge attention={step.attention} />
                {changedCount > 0 && (
                  <Badge
                    miw="max-content"
                    size="sm"
                    color="revision"
                    variant="light"
                  >
                    <FormattedMessage
                      defaultMessage="{changedCount} changed"
                      values={{ changedCount }}
                    />
                  </Badge>
                )}
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
