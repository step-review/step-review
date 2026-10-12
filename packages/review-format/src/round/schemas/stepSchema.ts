import * as v from "valibot";
import identifierSchema from "./identifierSchema.ts";
import markdownSchema from "./markdownSchema.ts";
import stepFileSchema from "./stepFileSchema.ts";
import stepNoteSchema from "./stepNoteSchema.ts";

export default v.strictObject({
  id: v.pipe(
    identifierSchema,
    v.description("Unique within the round. Used in URLs."),
  ),
  title: v.pipe(v.string(), v.minLength(1)),
  attention: v.pipe(
    v.picklist(["high", "normal", "low"]),
    v.description(
      "`high`: read carefully. `normal`: regular review. `low`: mechanical changes to skim.",
    ),
  ),
  intro: markdownSchema,
  notes: v.optional(v.array(stepNoteSchema)),
  files: v.pipe(v.array(stepFileSchema), v.minLength(1)),
});
