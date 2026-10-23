import { Box } from "@mantine/core";
import type FileIconGlyph from "../../../business-logic/file-icons/FileIconGlyph.ts";
import resolveFileIcon from "../../../business-logic/file-icons/resolveFileIcon.ts";
import setiFileIcons from "../../../business-logic/file-icons/setiFileIcons.ts";
import styles from "./FileIcon.module.css";

interface Props {
  path: string;
}

/** The icon VS Code's Seti theme shows for a file. */
export default function FileIcon({ path }: Props) {
  const { glyph, lightGlyph } = resolveFileIcon(
    path,
    setiFileIcons.fileIconTheme,
    setiFileIcons.languageAssociations,
  );
  return (
    <>
      <Glyph glyph={glyph} lightHidden />
      <Glyph glyph={lightGlyph} darkHidden />
    </>
  );
}

interface GlyphProps {
  glyph: FileIconGlyph;
  lightHidden?: boolean;
  darkHidden?: boolean;
}

function Glyph({ glyph, lightHidden, darkHidden }: GlyphProps) {
  return (
    <Box
      component="span"
      aria-hidden
      className={styles["icon"]}
      c={glyph.color ?? undefined}
      lightHidden={lightHidden}
      darkHidden={darkHidden}
    >
      {glyph.character}
    </Box>
  );
}
