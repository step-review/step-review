import type ReviewFile from "./ReviewFile.ts";
import type ReviewFileProblem from "./ReviewFileProblem.ts";

type ParseReviewFileResult =
  | { success: true; reviewFile: ReviewFile }
  | { success: false; problems: ReviewFileProblem[] };

export default ParseReviewFileResult;
