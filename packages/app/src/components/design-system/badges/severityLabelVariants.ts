import type { LabelColorOptions } from "@primer/react";
import type { IssueSeverity } from "@step-review/review-format";

/** The Primer label color of each severity, shared by its badges. */
const severityLabelVariants: Record<IssueSeverity, LabelColorOptions> = {
  blocker: "danger",
  concern: "attention",
  question: "done",
  nit: "secondary",
};

export default severityLabelVariants;
