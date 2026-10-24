import * as v from "valibot";
import markdownSchema from "./markdownSchema.ts";

export default v.strictObject({
  summary: v.pipe(
    markdownSchema,
    v.description("What the changes do, in a paragraph or two."),
  ),
  readingPlan: v.optional(
    v.pipe(
      markdownSchema,
      v.description("How the steps are ordered and how to go through them."),
    ),
  ),
});
