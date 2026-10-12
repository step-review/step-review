import { Button, Group, Textarea } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";

interface Props {
  noteId: string;
}

/** Lets the reviewer accept or dismiss an issue, and reply to it. */
export default function IssueVerdictControls({ noteId }: Props) {
  const intl = useIntl();
  const { reviewState, dispatch } = useReviewState();
  const issueVerdict = reviewState.issueVerdicts[noteId] ?? {
    verdict: null,
    reply: "",
  };
  const [isReplying, setIsReplying] = useState(issueVerdict.reply !== "");
  const setVerdict = (verdict: "accepted" | "dismissed") =>
    dispatch({
      type: "setIssueVerdict",
      noteId,
      issueVerdict: {
        ...issueVerdict,
        verdict: issueVerdict.verdict === verdict ? null : verdict,
      },
    });
  return (
    <div>
      <Group gap={4}>
        <Button
          size="compact-xs"
          color="success"
          variant={issueVerdict.verdict === "accepted" ? "filled" : "subtle"}
          leftSection={<IconCheck size={12} />}
          onClick={() => setVerdict("accepted")}
        >
          <FormattedMessage defaultMessage="Accept" />
        </Button>
        <Button
          size="compact-xs"
          color="gray"
          variant={issueVerdict.verdict === "dismissed" ? "filled" : "subtle"}
          leftSection={<IconX size={12} />}
          onClick={() => setVerdict("dismissed")}
        >
          <FormattedMessage defaultMessage="Dismiss" />
        </Button>
        {!isReplying && (
          <Button
            size="compact-xs"
            variant="subtle"
            onClick={() => setIsReplying(true)}
          >
            <FormattedMessage defaultMessage="Reply" />
          </Button>
        )}
      </Group>
      {isReplying && (
        <Textarea
          mt={6}
          size="xs"
          autosize
          minRows={2}
          placeholder={intl.formatMessage({
            defaultMessage: "Your reply, for the agent",
          })}
          value={issueVerdict.reply}
          onChange={(event) =>
            dispatch({
              type: "setIssueVerdict",
              noteId,
              issueVerdict: {
                ...issueVerdict,
                reply: event.currentTarget.value,
              },
            })
          }
        />
      )}
    </div>
  );
}
