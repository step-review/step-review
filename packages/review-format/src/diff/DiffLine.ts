export default interface DiffLine {
  type: "context" | "addition" | "deletion";
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
  noNewlineAtEnd: boolean;
}
