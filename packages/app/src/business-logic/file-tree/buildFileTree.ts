import type FileTreeNode from "./FileTreeNode.ts";

type FolderNode<File> = Extract<FileTreeNode<File>, { kind: "folder" }>;

/**
 * Arranges files in a tree of folders, keeping their order. A folder whose only
 * child is a folder is merged with it (`src/components`), as GitHub does.
 */
export default function buildFileTree<File>(
  files: File[],
  getPath: (file: File) => string,
): FileTreeNode<File>[] {
  const root: FileTreeNode<File>[] = [];
  for (const file of files) {
    const segments = getPath(file).split("/");
    let children = root;
    for (const [index, segment] of segments.slice(0, -1).entries()) {
      const path = segments.slice(0, index + 1).join("/");
      let folder = children.find(
        (node): node is FolderNode<File> =>
          node.kind === "folder" && node.path === path,
      );
      if (!folder) {
        folder = { kind: "folder", path, label: segment, children: [] };
        children.push(folder);
      }
      children = folder.children;
    }
    children.push({ kind: "file", label: segments.at(-1)!, file });
  }
  return root.map(mergeSingleChildFolders);
}

function mergeSingleChildFolders<File>(
  node: FileTreeNode<File>,
): FileTreeNode<File> {
  if (node.kind === "file") {
    return node;
  }
  let folder = node;
  let onlyChild = folder.children.length === 1 ? folder.children[0] : null;
  while (onlyChild?.kind === "folder") {
    folder = { ...onlyChild, label: `${folder.label}/${onlyChild.label}` };
    onlyChild = folder.children.length === 1 ? folder.children[0] : null;
  }
  return { ...folder, children: folder.children.map(mergeSingleChildFolders) };
}
