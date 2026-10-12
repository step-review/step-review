export default interface ReviewFileProblem {
  message: string;
  /** Where the problem is, e.g. `round 2, steps[0].files[1].path`. */
  location: string | null;
}
