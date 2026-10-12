export default class DiffParseError extends Error {
  /** 1-based line number within the parsed diff text. */
  lineNumber: number;

  constructor(message: string, lineNumber: number) {
    super(message);
    this.name = "DiffParseError";
    this.lineNumber = lineNumber;
  }
}
