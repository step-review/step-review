import type Hunk from "../diff/Hunk.ts";
import type StepFile from "../round/types/StepFile.ts";
import findDiffLine from "./findDiffLine.ts";

/** Returns a message for each note whose anchor does not match the diff. */
export default function checkNoteAnchors(
  stepFile: StepFile,
  hunks: Hunk[],
): string[] {
  const messages: string[] = [];
  for (const note of stepFile.notes ?? []) {
    const anchor = note.anchor;
    if (!anchor) {
      continue;
    }
    const where = `Note \`${note.id}\` (${anchor.side} line ${anchor.line} of \`${stepFile.path}\`)`;
    const diffLine = findDiffLine(hunks, anchor.side, anchor.line);
    if (!diffLine) {
      messages.push(
        `${where} points at a line that is not in the step's diff.`,
      );
      continue;
    }
    if (anchor.endLine !== undefined && anchor.endLine < anchor.line) {
      messages.push(`${where} ends before it starts.`);
    }
    if (
      anchor.text !== undefined &&
      anchor.text.trim() !== diffLine.content.trim()
    ) {
      messages.push(
        `${where} expects \`${anchor.text.trim()}\`, but the line is \`${diffLine.content.trim()}\`.`,
      );
    }
  }
  return messages;
}
