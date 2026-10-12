import * as v from "valibot";
import diffSideSchema from "./diffSideSchema.ts";
import lineNumberSchema from "./lineNumberSchema.ts";

export default v.strictObject({
  side: diffSideSchema,
  line: v.pipe(
    lineNumberSchema,
    v.description("Line number in the file at that side's commit."),
  ),
  endLine: v.optional(
    v.pipe(
      lineNumberSchema,
      v.description("Last line of the range, when the note spans lines."),
    ),
  ),
  text: v.optional(
    v.pipe(
      v.string(),
      v.description(
        "Content of `line`, without the diff prefix. Used to detect a wrong line number.",
      ),
    ),
  ),
});
