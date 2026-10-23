import * as v from "valibot";
import markdownSchema from "./markdownSchema.ts";
import noteIdSchema from "./noteIdSchema.ts";

export default v.strictObject({
  id: noteIdSchema,
  kind: v.pipe(
    v.literal("explainer"),
    v.description("Explains what a change does or why it was made."),
  ),
  body: markdownSchema,
});
