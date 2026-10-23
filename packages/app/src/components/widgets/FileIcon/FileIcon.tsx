import { useTheme } from "@primer/react/next";
import resolveFileIcon from "../../../business-logic/file-icons/resolveFileIcon.ts";
import setiFileIcons from "../../../business-logic/file-icons/setiFileIcons.ts";
import styles from "./FileIcon.module.css";

interface Props {
  path: string;
}

/** The icon VS Code's Seti theme shows for a file. */
export default function FileIcon({ path }: Props) {
  const { resolvedColorMode } = useTheme();
  const { glyph, lightGlyph } = resolveFileIcon(
    path,
    setiFileIcons.fileIconTheme,
    setiFileIcons.languageAssociations,
  );
  const isDark = resolvedColorMode === "night" || resolvedColorMode === "dark";
  const shownGlyph = isDark ? glyph : lightGlyph;
  return (
    <span
      aria-hidden
      className={styles["icon"]}
      style={{ color: shownGlyph.color ?? undefined }}
    >
      {shownGlyph.character}
    </span>
  );
}
