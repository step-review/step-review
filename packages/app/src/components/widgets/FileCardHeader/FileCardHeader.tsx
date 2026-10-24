import { ChevronDownIcon, ChevronRightIcon } from "@primer/octicons-react";
import { Checkbox, IconButton, Label } from "@primer/react";
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
  isCollapsed: boolean;
  isViewed: boolean;
  onToggleCollapsed: () => void;
  onViewedChange: (isViewed: boolean) => void;
}

/** The header of a file's diff, laid out like GitHub's. */
export default function FileCardHeader({
  stepFileView,
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
      <IconButton
        variant="invisible"
        size="small"
        icon={isCollapsed ? ChevronRightIcon : ChevronDownIcon}
        className={styles["collapseButton"]}
        onClick={onToggleCollapsed}
        aria-label={intl.formatMessage({
          defaultMessage: "Show or hide the diff",
        })}
        aria-expanded={!isCollapsed}
      />
      {/* Modified is the usual case, so only the others are pointed out. */}
      {fileDiff.status !== "modified" && (
        <FileStatusBadge status={fileDiff.status} />
      )}
      <div className={styles["path"]} onClick={onToggleCollapsed}>
        <TruncatedText tooltip={displayedPath} truncateFrom="start">
          {displayedPath}
        </TruncatedText>
      </div>
      <CopyIconButton
        value={stepFileView.path}
        label={intl.formatMessage({ defaultMessage: "Copy the path" })}
      />
      <div className={styles["trailing"]}>
        <Diffstat
          additions={stepFileView.additions}
          deletions={stepFileView.deletions}
          blocks={diffstatBlocks(
            stepFileView.additions,
            stepFileView.deletions,
          )}
        />
        {noteCount > 0 && (
          <Label variant="secondary">
            <FormattedMessage
              defaultMessage="{noteCount, plural, one {# note} other {# notes}}"
              values={{ noteCount }}
            />
          </Label>
        )}
        {/* GitHub's checkbox styled as a button. */}
        <label className={styles["viewed"]} data-viewed={isViewed || undefined}>
          <Checkbox
            checked={isViewed}
            onChange={(event) => onViewedChange(event.currentTarget.checked)}
          />
          <FormattedMessage defaultMessage="Viewed" />
        </label>
      </div>
    </div>
  );
}
