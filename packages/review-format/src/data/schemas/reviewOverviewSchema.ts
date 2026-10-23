import * as v from "valibot";
import markdownSchema from "./markdownSchema.ts";

export default v.strictObject({
  summary: v.pipe(
    markdownSchema,
    v.description("What the changes do, in a paragraph or two."),
  ),
  areas: v.optional(
    v.pipe(
      v.array(
        v.strictObject({
          title: v.pipe(v.string(), v.minLength(1)),
          points: v.pipe(v.array(markdownSchema), v.minLength(1)),
        }),
      ),
      v.description("The main areas of change, with their key points."),
    ),
  ),
  readingPlan: v.optional(
    v.pipe(
      markdownSchema,
      v.description("How the steps are ordered and how to go through them."),
    ),
  ),
});
