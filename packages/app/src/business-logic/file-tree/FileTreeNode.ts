type FileTreeNode<File> =
  | {
      kind: "folder";
      /** Full path of the folder, unique in the tree. */
      path: string;
      /** One or more path segments, e.g. `src/components`. */
      label: string;
      children: FileTreeNode<File>[];
    }
  | { kind: "file"; label: string; file: File };

export default FileTreeNode;
