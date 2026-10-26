export default interface CommandResult {
  /**
   * 0 when the review has no problems, 1 when it has, 2 when the command is
   * used wrongly.
   */
  exitCode: number;
  output: string;
}
