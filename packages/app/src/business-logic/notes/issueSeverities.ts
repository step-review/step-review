import type { IssueSeverity } from "@step-review/review-format";

/** The issue severities, from the most to the least severe. */
const issueSeverities: IssueSeverity[] = [
  "blocker",
  "concern",
  "question",
  "nit",
];

export default issueSeverities;
