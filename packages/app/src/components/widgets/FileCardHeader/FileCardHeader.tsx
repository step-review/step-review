import { ActionIcon, Badge, Box, Button, Group, Tooltip } from "@mantine/core";
import {
  IconBrandGithub,
  IconChevronDown,
  IconSquare,
  IconSquareCheckFilled,
} from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import diffstatBlocks from "../../../business-logic/diff-layout/diffstatBlocks.ts";
import type StepFileView from "../../../business-logic/review-view/StepFileView.ts";
import FileStatusBadge from "../../design-system/badges/FileStatusBadge.tsx";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import Diffstat from "../../design-system/Diffstat/Diffstat.tsx";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import styles from "./FileCardHeader.module.css";

interface Props {
  stepFileView: StepFileView;
  githubUrl: string | null;
  isCollapsed: boolean;
  isViewed: boolean;
  onToggleCollapsed: () => void;
  onViewedChange: (isViewed: boolean) => void;
}

/** The header of a file's diff, laid out like GitHub's. */
export default function FileCardHeader({
  stepFileView,
  githubUrl,
  isCollapsed,
  isViewed,
  onToggleCollapsed,
  onViewedChange,
}: Props) {
  const intl = useIntl();
  const { fileDiff } = stepFileView;
  const noteCount = stepFileView.notes.length;
  const displayedPath = fileDiff.oldPath
    ? `${fileDiff.oldPath} → ${stepFileView.path}`
    : stepFileView.path;
  return (
    <div className={styles["header"]} data-collapsed={isCollapsed || undefined}>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        onClick={onToggleCollapsed}
        aria-label={intl.formatMessage({
          defaultMessage: "Show or hide the diff",
        })}
        aria-expanded={!isCollapsed}
      >
        <IconChevronDown
          size={16}
          className={styles["chevron"]}
          data-collapsed={isCollapsed || undefined}
        />
      </ActionIcon>
      {/* Modified is the usual case, so only the others are pointed out. */}
      {fileDiff.status !== "modified" && (
        <FileStatusBadge status={fileDiff.status} />
      )}
      <Box className={styles["path"]} onClick={onToggleCollapsed}>
        <TruncatedText
          tooltip={displayedPath}
          truncateFrom="start"
          size="xs"
          ff="monospace"
        >
          {displayedPath}
        </TruncatedText>
      </Box>
      <CopyIconButton
        value={stepFileView.path}
        label={intl.formatMessage({ defaultMessage: "Copy the path" })}
      />
      {githubUrl && (
        <Tooltip
          label={<FormattedMessage defaultMessage="Open on GitHub" />}
          withArrow
        >
          <ActionIcon
            component="a"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={intl.formatMessage({
              defaultMessage: "Open on GitHub",
            })}
          >
            <IconBrandGithub size={14} />
          </ActionIcon>
        </Tooltip>
      )}
      <Group gap="sm" ml="auto" wrap="nowrap">
        <Diffstat
          additions={stepFileView.additions}
          deletions={stepFileView.deletions}
          blocks={diffstatBlocks(
            stepFileView.additions,
            stepFileView.deletions,
          )}
        />
        {noteCount > 0 && (
          <Badge miw="max-content" size="sm" variant="light" color="gray">
            <FormattedMessage
              defaultMessage="{noteCount, plural, one {# note} other {# notes}}"
              values={{ noteCount }}
            />
          </Badge>
        )}
        <Button
          variant="default"
          size="xs"
          aria-pressed={isViewed}
          onClick={() => onViewedChange(!isViewed)}
          leftSection={
            isViewed ? (
              <IconSquareCheckFilled
                size={16}
                color="var(--mantine-primary-color-filled)"
              />
            ) : (
              <IconSquare size={16} />
            )
          }
        >
          <FormattedMessage defaultMessage="Viewed" />
        </Button>
      </Group>
    </div>
  );
}
