import { CheckIcon } from "@primer/octicons-react";
import { TreeView } from "@primer/react";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import buildFileTree from "../../../business-logic/file-tree/buildFileTree.ts";
import type FileTreeNode from "../../../business-logic/file-tree/FileTreeNode.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import type StepFileView from "../../../business-logic/review-view/StepFileView.ts";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import formatFileStatus from "../../design-system/badges/formatFileStatus.ts";
import FileStatusIcon from "../../design-system/FileStatusIcon/FileStatusIcon.tsx";
import useFollowingScroll from "../../design-system/hooks/useFollowingScroll.ts";
import NoteCounts from "../../design-system/NoteCounts/NoteCounts.tsx";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import ParticipantsHere from "../ParticipantsHere/ParticipantsHere.tsx";
import styles from "./StepFileTree.module.css";

interface Props {
  stepView: StepView;
  /** The file being viewed, if any. */
  currentFileId: string | null;
  onFileSelect: (fileFragment: string) => void;
}

/**
 * The files of a step, in a tree of folders. The file being viewed stands out,
 * with the folders it's in, and the tree scrolls along with it.
 */
export default function StepFileTree({
  stepView,
  currentFileId,
  onFileSelect,
}: Props) {
  const intl = useIntl();
  const fileTree = useMemo(
    () => buildFileTree(stepView.files, (file) => file.path),
    [stepView.files],
  );
  const currentFile =
    stepView.files.find((file) => file.id === currentFileId) ?? null;
  useFollowingScroll(
    currentFileId === null ? null : treeItemId(`file-${currentFileId}`),
  );
  return (
    <div className={styles["tree"]}>
      {/* The labels truncate themselves, to show the full path on hover. */}
      <TreeView
        truncate={false}
        aria-label={intl.formatMessage({ defaultMessage: "Files of the step" })}
      >
        <FileTreeNodes
          nodes={fileTree}
          currentFile={currentFile}
          onFileSelect={onFileSelect}
        />
      </TreeView>
    </div>
  );
}

interface FileTreeNodesProps {
  nodes: FileTreeNode<StepFileView>[];
  currentFile: StepFileView | null;
  onFileSelect: (fileFragment: string) => void;
}

function FileTreeNodes({
  nodes,
  currentFile,
  onFileSelect,
}: FileTreeNodesProps) {
  const intl = useIntl();
  const viewedFingerprints = useViewedFingerprints();
  return nodes.map((node) => {
    if (node.kind === "folder") {
      const containsCurrentFile =
        currentFile?.path.startsWith(`${node.path}/`) ?? false;
      return (
        <TreeView.Item
          key={node.path}
          id={`folder-${node.path}`}
          defaultExpanded
        >
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          <span
            className={styles["folderName"]}
            data-contains-current={containsCurrentFile || undefined}
          >
            <TruncatedText tooltip={node.path}>{node.label}</TruncatedText>
          </span>
          <TreeView.SubTree>
            <FileTreeNodes
              nodes={node.children}
              currentFile={currentFile}
              onFileSelect={onFileSelect}
            />
          </TreeView.SubTree>
        </TreeView.Item>
      );
    }
    const stepFileView = node.file;
    const fileFragment = `file-${stepFileView.id}`;
    const isViewed = viewedFingerprints.has(stepFileView.fingerprint);
    const noteKindCounts = countNotes(stepFileView.notes);
    const issueCount = Object.values(
      noteKindCounts.issueCountsBySeverity,
    ).reduce((sum, count) => sum + count, 0);
    // The marks are hidden from assistive technology, which reads this instead.
    const marksLabel = intl.formatList([
      formatFileStatus(intl, stepFileView.fileDiff.status),
      ...(issueCount > 0
        ? [
            intl.formatMessage(
              {
                defaultMessage:
                  "{issueCount, plural, one {# issue} other {# issues}}",
              },
              { issueCount },
            ),
          ]
        : []),
      ...(noteKindCounts.explainerCount > 0
        ? [
            intl.formatMessage(
              {
                defaultMessage:
                  "{explainerCount, plural, one {# note} other {# notes}}",
              },
              { explainerCount: noteKindCounts.explainerCount },
            ),
          ]
        : []),
      ...(isViewed ? [intl.formatMessage({ defaultMessage: "Viewed" })] : []),
    ]);
    return (
      <TreeView.Item
        key={stepFileView.id}
        // Not the fragment: that's the ID of the file's card, to scroll to.
        id={treeItemId(fileFragment)}
        current={stepFileView.id === currentFile?.id}
        onSelect={() => onFileSelect(fileFragment)}
      >
        <TreeView.LeadingVisual>
          <FileStatusIcon status={stepFileView.fileDiff.status} />
        </TreeView.LeadingVisual>
        {/* Viewed files are dimmed, and deleted ones struck through. */}
        <span
          className={styles["fileName"]}
          data-status={stepFileView.fileDiff.status}
          data-viewed={isViewed || undefined}
        >
          <TruncatedText tooltip={stepFileView.path}>
            <span className={styles["fileLabel"]}>{node.label}</span>
          </TruncatedText>
        </span>
        <TreeView.TrailingVisual label={marksLabel}>
          <span className={styles["marks"]}>
            <ParticipantsHere fileId={stepFileView.id} />
            <NoteCounts {...noteKindCounts} isCompact />
            {isViewed && <CheckIcon className={styles["viewedIcon"]} />}
          </span>
        </TreeView.TrailingVisual>
      </TreeView.Item>
    );
  });
}

function treeItemId(fileFragment: string): string {
  return `tree-${fileFragment}`;
}
