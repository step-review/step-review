import { CheckIcon } from "@primer/octicons-react";
import { TreeView } from "@primer/react";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import buildFileTree from "../../../business-logic/file-tree/buildFileTree.ts";
import type FileTreeNode from "../../../business-logic/file-tree/FileTreeNode.ts";
import useFragment from "../../../business-logic/navigation/useFragment.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import type StepFileView from "../../../business-logic/review-view/StepFileView.ts";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import FileIcon from "../FileIcon/FileIcon.tsx";
import styles from "./StepFileTree.module.css";

interface Props {
  stepView: StepView;
  onFileSelect: (fileFragment: string) => void;
}

/** The files of a step, in a tree of folders. */
export default function StepFileTree({ stepView, onFileSelect }: Props) {
  const intl = useIntl();
  const fileTree = useMemo(
    () => buildFileTree(stepView.files, (file) => file.path),
    [stepView.files],
  );
  return (
    <div className={styles["tree"]}>
      {/* The labels truncate themselves, to show the full path on hover. */}
      <TreeView
        truncate={false}
        aria-label={intl.formatMessage({ defaultMessage: "Files of the step" })}
      >
        <FileTreeNodes nodes={fileTree} onFileSelect={onFileSelect} />
      </TreeView>
    </div>
  );
}

interface FileTreeNodesProps {
  nodes: FileTreeNode<StepFileView>[];
  onFileSelect: (fileFragment: string) => void;
}

function FileTreeNodes({ nodes, onFileSelect }: FileTreeNodesProps) {
  const intl = useIntl();
  const viewedFingerprints = useViewedFingerprints();
  const fragment = useFragment();
  return nodes.map((node) => {
    if (node.kind === "folder") {
      return (
        <TreeView.Item
          key={node.path}
          id={`folder-${node.path}`}
          defaultExpanded
        >
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          <TruncatedText tooltip={node.path}>{node.label}</TruncatedText>
          <TreeView.SubTree>
            <FileTreeNodes nodes={node.children} onFileSelect={onFileSelect} />
          </TreeView.SubTree>
        </TreeView.Item>
      );
    }
    const stepFileView = node.file;
    const fileFragment = `file-${stepFileView.id}`;
    const isViewed = viewedFingerprints.has(stepFileView.fingerprint);
    return (
      <TreeView.Item
        key={stepFileView.id}
        id={fileFragment}
        current={fragment === fileFragment}
        onSelect={() => onFileSelect(fileFragment)}
      >
        <TreeView.LeadingVisual>
          <FileIcon path={stepFileView.path} />
        </TreeView.LeadingVisual>
        {/* Viewed files are dimmed. */}
        <span
          className={styles["fileName"]}
          data-viewed={isViewed || undefined}
        >
          <TruncatedText tooltip={stepFileView.path}>
            {node.label}
          </TruncatedText>
        </span>
        {isViewed && (
          <TreeView.TrailingVisual
            label={intl.formatMessage({ defaultMessage: "Viewed" })}
          >
            <CheckIcon className={styles["viewedIcon"]} />
          </TreeView.TrailingVisual>
        )}
      </TreeView.Item>
    );
  });
}
