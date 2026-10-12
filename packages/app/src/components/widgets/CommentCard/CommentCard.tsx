import { ActionIcon, Group, Paper, Text, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import type ReviewerComment from "../../../business-logic/review-state/ReviewerComment.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import Markdown from "../../design-system/Markdown/Markdown.tsx";
import CommentEditor from "../CommentEditor/CommentEditor.tsx";
import styles from "./CommentCard.module.css";

interface Props {
  comment: ReviewerComment;
}

/** A comment written by the reviewer. */
export default function CommentCard({ comment }: Props) {
  const intl = useIntl();
  const { dispatch } = useReviewState();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Paper withBorder p="xs" className={styles["card"]}>
      {isEditing ? (
        <CommentEditor
          initialBody={comment.body}
          onCancel={() => setIsEditing(false)}
          onSave={(body) => {
            dispatch({ type: "updateComment", commentId: comment.id, body });
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <Group gap={6} mb={4}>
            <IconUser size={14} />
            <Text size="xs" fw={600}>
              <FormattedMessage defaultMessage="Your comment" />
            </Text>
            <Group gap={2} ml="auto">
              <Tooltip
                label={<FormattedMessage defaultMessage="Edit" />}
                withArrow
              >
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  aria-label={intl.formatMessage({ defaultMessage: "Edit" })}
                  onClick={() => setIsEditing(true)}
                >
                  <IconPencil size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={<FormattedMessage defaultMessage="Delete" />}
                withArrow
              >
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  aria-label={intl.formatMessage({ defaultMessage: "Delete" })}
                  onClick={() =>
                    dispatch({ type: "deleteComment", commentId: comment.id })
                  }
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <Markdown>{comment.body}</Markdown>
        </>
      )}
    </Paper>
  );
}
