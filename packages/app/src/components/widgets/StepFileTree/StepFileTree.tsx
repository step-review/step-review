import { Group, NavLink } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import { useMemo } from "react";
import type { MouseEvent } from "react";
import buildFileTree from "../../../business-logic/file-tree/buildFileTree.ts";
import type FileTreeNode from "../../../business-logic/file-tree/FileTreeNode.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useFragment from "../../../business-logic/navigation/useFragment.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import type StepFileView from "../../../business-logic/review-view/StepFileView.ts";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import FileIcon from "../FileIcon/FileIcon.tsx";

interface Props {
  stepView: StepView;
  onFileClick: (event: MouseEvent, fileFragment: string) => void;
}

/** Indentation of each tree level, in pixels. */
const levelIndent = 12;

/** The files of a step, in a tree of folders. */
export default function StepFileTree({ stepView, onFileClick }: Props) {
  const fileTree = useMemo(
    () => buildFileTree(stepView.files, (file) => file.path),
    [stepView.files],
  );
  return (
    <FileTreeNodes
      nodes={fileTree}
      depth={0}
      stepView={stepView}
      onFileClick={onFileClick}
    />
  );
}

interface FileTreeNodesProps extends Props {
  nodes: FileTreeNode<StepFileView>[];
  depth: number;
}

function FileTreeNodes({
  nodes,
  depth,
  stepView,
  onFileClick,
}: FileTreeNodesProps) {
  const viewedFingerprints = useViewedFingerprints();
  const fragment = useFragment();
  return nodes.map((node) => {
    const paddingLeft = 10 + depth * levelIndent;
    if (node.kind === "folder") {
      return (
        <div key={node.path}>
          <Group gap={6} wrap="nowrap" pl={paddingLeft} py={2}>
            <IconFolder size={14} color="var(--mantine-color-dimmed)" />
            <TruncatedText size="xs" c="dimmed" tooltip={node.path} isUnkerned>
              {node.label}
            </TruncatedText>
          </Group>
          <FileTreeNodes
            nodes={node.children}
            depth={depth + 1}
            stepView={stepView}
            onFileClick={onFileClick}
          />
        </div>
      );
    }
    const stepFileView = node.file;
    const fileFragment = `file-${stepFileView.id}`;
    return (
      <NavLink
        key={stepFileView.id}
        component="a"
        pl={paddingLeft}
        pr="xs"
        py={2}
        href={`${routeHref({ name: RouteName.Step, stepId: stepView.id })}#${encodeURIComponent(fileFragment)}`}
        active={fragment === fileFragment}
        onClick={(event) => onFileClick(event, fileFragment)}
        leftSection={<FileIcon path={stepFileView.path} />}
        label={
          // Viewed files are dimmed.
          <TruncatedText
            size="xs"
            c={
              viewedFingerprints.has(stepFileView.fingerprint)
                ? "dimmed"
                : undefined
            }
            tooltip={stepFileView.path}
            isUnkerned
          >
            {node.label}
          </TruncatedText>
        }
      />
    );
  });
}
