import { Alert, Group, List } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import Markdown from "../../design-system/Markdown/Markdown.tsx";

interface Props {
  loadedReview: LoadedReview;
}

/** Problems in the review file that the agent should fix. */
export default function ReviewWarnings({ loadedReview }: Props) {
  const intl = useIntl();
  const { warnings } = loadedReview;
  if (warnings.length === 0) {
    return null;
  }
  const warningsText = [
    `The review in \`${loadedReview.fileName}\` has these problems. Fix them:`,
    ...warnings.map((warning) => `- ${warning}`),
  ].join("\n");
  return (
    <Alert
      color="warning"
      icon={<IconAlertTriangle />}
      title={
        <Group gap="xs">
          <FormattedMessage
            defaultMessage="{warningCount, plural, one {The review has # problem} other {The review has # problems}}"
            values={{ warningCount: warnings.length }}
          />
          <CopyIconButton
            value={warningsText}
            label={intl.formatMessage({
              defaultMessage: "Copy for your agent",
            })}
          />
        </Group>
      }
    >
      <List size="sm" spacing={2}>
        {warnings.map((warning, index) => (
          <List.Item key={index}>
            <Markdown>{warning}</Markdown>
          </List.Item>
        ))}
      </List>
    </Alert>
  );
}
