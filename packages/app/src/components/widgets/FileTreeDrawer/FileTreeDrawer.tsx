import {
  Drawer,
  Group,
  Text,
  Tree,
  getTreeExpandedState,
  useTree,
  type TreeNodeData,
} from "@mantine/core";
import {
  IconChevronDown,
  IconCircleCheck,
  IconFile,
  IconFolder,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import buildFileTree from "../../../business-logic/file-tree/buildFileTree.ts";
import type FileTreeNode from "../../../business-logic/file-tree/FileTreeNode.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import type RoundView from "../../../business-logic/rounds/RoundView.ts";
import StepTitle from "../StepTitle/StepTitle.tsx";

interface Props {
  roundView: RoundView;
  opened: boolean;
  onClose: () => void;
}

function toTreeNodeData(node: FileTreeNode): TreeNodeData {
  return {
    value: node.value,
    label: node.label,
    children: node.children.map(toTreeNodeData),
  };
}

function indexNodes(nodes: FileTreeNode[], index: Map<string, FileTreeNode>) {
  for (const node of nodes) {
    index.set(node.value, node);
    indexNodes(node.children, index);
  }
  return index;
}

/** All files of the round as a tree, with their step and viewed state. */
export default function FileTreeDrawer({ roundView, opened, onClose }: Props) {
  const viewedFingerprints = useViewedFingerprints();
  const { data, nodesByValue } = useMemo(() => {
    const fileTree = buildFileTree(roundView);
    return {
      data: fileTree.map(toTreeNodeData),
      nodesByValue: indexNodes(fileTree, new Map()),
    };
  }, [roundView]);
  const tree = useTree({
    initialExpandedState: getTreeExpandedState(data, "*"),
  });
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={<FormattedMessage defaultMessage="Files" />}
    >
      <Tree
        data={data}
        tree={tree}
        levelOffset="md"
        renderNode={({ node, expanded, hasChildren, elementProps }) => {
          const file = nodesByValue.get(node.value)?.file;
          return (
            <Group gap={6} wrap="nowrap" {...elementProps}>
              {hasChildren ? (
                <IconChevronDown
                  size={14}
                  style={{ transform: expanded ? undefined : "rotate(-90deg)" }}
                />
              ) : file &&
                viewedFingerprints.has(file.stepFileView.fingerprint) ? (
                <IconCircleCheck
                  size={14}
                  color="var(--mantine-color-success-filled)"
                />
              ) : (
                <IconFile size={14} />
              )}
              {hasChildren && <IconFolder size={14} />}
              <Text
                size="sm"
                ff="monospace"
                truncate
                onClick={() => {
                  if (file) {
                    navigateTo(
                      {
                        name: RouteName.Step,
                        roundNumber: roundView.round.number,
                        stepId: file.stepView.id,
                      },
                      `file-${file.stepFileView.id}`,
                    );
                    onClose();
                  }
                }}
              >
                {node.label}
              </Text>
              {file && (
                <Text size="xs" c="dimmed" truncate>
                  {file.stepView.number}. <StepTitle step={file.stepView} />
                </Text>
              )}
            </Group>
          );
        }}
      />
    </Drawer>
  );
}
