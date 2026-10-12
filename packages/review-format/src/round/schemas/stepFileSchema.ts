import * as v from "valibot";
import fileNoteSchema from "./fileNoteSchema.ts";
import lineRangeSchema from "./lineRangeSchema.ts";
import markdownSchema from "./markdownSchema.ts";

export default v.strictObject({
  path: v.pipe(
    v.string(),
    v.minLength(1),
    v.description(
      "Path of the file as it appears in the diff: the new path, or the old path for a deleted file.",
    ),
  ),
  ranges: v.optional(
    v.pipe(
      v.array(lineRangeSchema),
      v.minLength(1),
      v.description(
        "Show only the hunks overlapping these line ranges. Omit to show the whole file. Use it when a file's changes belong to different steps.",
      ),
    ),
  ),
  summary: v.optional(
    v.pipe(
      markdownSchema,
      v.description(
        "Shown instead of the diff, e.g. for generated files. The diff stays available on demand.",
      ),
    ),
  ),
  notes: v.optional(v.array(fileNoteSchema)),
});
