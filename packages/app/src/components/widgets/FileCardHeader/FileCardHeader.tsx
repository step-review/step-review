import {
  ActionIcon,
  Badge,
  Checkbox,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconBrandGithub, IconChevronDown } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import type StepFileView from "../../../business-logic/rounds/StepFileView.ts";
import FileChangeBadge from "../../design-system/badges/FileChangeBadge.tsx";
import FileStatusBadge from "../../design-system/badges/FileStatusBadge.tsx";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import styles from "./FileCardHeader.module.css";

interface Props {
  stepFileView: StepFileView;
  previousRoundNumber: number | null;
  githubUrl: string | null;
  isCollapsed: boolean;
  isViewed: boolean;
  onToggleCollapsed: () => void;
  onViewedChange: (isViewed: boolean) => void;
}

export default function FileCardHeader({
  stepFileView,
  previousRoundNumber,
  githubUrl,
  isCollapsed,
  isViewed,
  onToggleCollapsed,
  onViewedChange,
}: Props) {
  const intl = useIntl();
  const { fileDiff } = stepFileView;
  const noteCount = stepFileView.notes.length;
  return (
    <div className={styles["header"]} data-viewed={isViewed || undefined}>
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
      <FileStatusBadge status={fileDiff.status} />
      {previousRoundNumber !== null && (
        <FileChangeBadge
          change={stepFileView.change}
          previousRoundNumber={previousRoundNumber}
        />
      )}
      <Text
        className={styles["path"]}
        ff="monospace"
        size="sm"
        onClick={onToggleCollapsed}
      >
        {fileDiff.oldPath && (
          <Text span c="dimmed" ff="monospace" size="sm">
            {fileDiff.oldPath} →{" "}
          </Text>
        )}
        {stepFileView.path}
      </Text>
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
      <Group gap={8} ml="auto" wrap="nowrap">
        <Text size="xs" ff="monospace" c="addition" fw={600}>
          +{stepFileView.additions}
        </Text>
        <Text size="xs" ff="monospace" c="removal" fw={600}>
          −{stepFileView.deletions}
        </Text>
        {noteCount > 0 && (
          <Badge miw="max-content" size="sm" variant="light" color="gray">
            <FormattedMessage
              defaultMessage="{noteCount, plural, one {# note} other {# notes}}"
              values={{ noteCount }}
            />
          </Badge>
        )}
        <Checkbox
          size="xs"
          label={<FormattedMessage defaultMessage="Viewed" />}
          checked={isViewed}
          onChange={(event) => onViewedChange(event.currentTarget.checked)}
        />
      </Group>
    </div>
  );
}
