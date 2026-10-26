import * as v from "valibot";
import formatVersion from "../formatVersion.ts";
import reviewOverviewSchema from "./reviewOverviewSchema.ts";
import reviewTargetSchema from "./reviewTargetSchema.ts";
import stepSchema from "./stepSchema.ts";

export default v.pipe(
  v.strictObject({
    $schema: v.optional(v.string()),
    version: v.literal(formatVersion),
    createdAt: v.pipe(
      v.string(),
      v.isoTimestamp(),
      v.description(
        "When the review was written, e.g. `2026-10-11T09:30:00Z`.",
      ),
    ),
    target: reviewTargetSchema,
    overview: reviewOverviewSchema,
    steps: v.pipe(v.array(stepSchema), v.minLength(1)),
  }),
  v.title("step-review review"),
  v.description(
    "The JSON section of a step-review file. See https://step-review.dev/SKILL.md.",
  ),
);
