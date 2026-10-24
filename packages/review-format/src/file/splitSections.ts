import type ReviewFileProblem from "./ReviewFileProblem.ts";
import type Section from "./Section.ts";
import type SectionKind from "./SectionKind.ts";
import sectionMarkerPrefix from "./sectionMarkerPrefix.ts";

const sectionKinds: SectionKind[] = ["review", "diff"];

export default function splitSections(text: string): {
  sections: Section[];
  problems: ReviewFileProblem[];
} {
  const sections: Section[] = [];
  const problems: ReviewFileProblem[] = [];
  const contentLines: string[] = [];
  let current: Omit<Section, "content"> | null = null;
  const finishSection = () => {
    if (current) {
      sections.push({ ...current, content: contentLines.join("\n") });
    }
    contentLines.length = 0;
  };
  for (const [index, rawLine] of text.split("\n").entries()) {
    const line = rawLine.replace(/\r$/u, "");
    if (!line.startsWith(sectionMarkerPrefix)) {
      if (current) {
        contentLines.push(line);
      } else if (line.trim() !== "") {
        problems.push({
          message: `The file must start with a \`${sectionMarkerPrefix}review\` line.`,
          location: `line ${index + 1}`,
        });
        return { sections, problems };
      }
      continue;
    }
    const kind = line.slice(sectionMarkerPrefix.length).trim();
    finishSection();
    if (!isSectionKind(kind)) {
      problems.push({
        message: `Unknown section \`${line}\`.`,
        location: `line ${index + 1}`,
      });
      return { sections, problems };
    }
    current = { kind, markerLineNumber: index + 1 };
  }
  finishSection();
  return { sections, problems };
}

function isSectionKind(kind: string): kind is SectionKind {
  return (sectionKinds as string[]).includes(kind);
}
