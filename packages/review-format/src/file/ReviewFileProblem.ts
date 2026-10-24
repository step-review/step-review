export default interface ReviewFileProblem {
  message: string;
  /** Where the problem is, e.g. `line 12` or `steps[0].files[1].path`. */
  location: string | null;
}
