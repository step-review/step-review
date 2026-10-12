import type RoundView from "../rounds/RoundView.ts";
import type FileTreeNode from "./FileTreeNode.ts";

/**
 * Builds the tree of the round's files. Folders with a single child folder are
 * merged (`src/components`), as in most code hosts.
 */
export default function buildFileTree(roundView: RoundView): FileTreeNode[] {
  const root: FileTreeNode = { value: "", label: "", children: [], file: null };
  for (const step of roundView.steps) {
    for (const file of step.files) {
      const segments = file.path.split("/");
      let parent = root;
      for (const [index, segment] of segments.entries()) {
        const isFile = index === segments.length - 1;
        const value = isFile
          ? `file:${file.id}`
          : `dir:${segments.slice(0, index + 1).join("/")}`;
        let node = parent.children.find((child) => child.value === value);
        if (!node) {
          node = {
            value,
            label: segment,
            children: [],
            file: isFile ? { stepView: step, stepFileView: file } : null,
          };
          parent.children.push(node);
        }
        parent = node;
      }
    }
  }
  return root.children.map(mergeSingleChildFolders);
}

function mergeSingleChildFolders(node: FileTreeNode): FileTreeNode {
  let current = node;
  while (
    !current.file &&
    current.children.length === 1 &&
    !current.children[0]!.file
  ) {
    const child = current.children[0]!;
    current = { ...child, label: `${current.label}/${child.label}` };
  }
  return {
    ...current,
    children: current.children.map(mergeSingleChildFolders),
  };
}
