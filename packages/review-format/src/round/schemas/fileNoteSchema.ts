import * as v from "valibot";
import explainerNoteSchema from "./explainerNoteSchema.ts";
import issueNoteSchema from "./issueNoteSchema.ts";
import lineAnchorSchema from "./lineAnchorSchema.ts";

const anchorSchema = v.optional(
  v.pipe(
    lineAnchorSchema,
    v.description("The line the note refers to. Omit for a file-level note."),
  ),
);

export default v.variant("kind", [
  v.strictObject({ ...explainerNoteSchema.entries, anchor: anchorSchema }),
  v.strictObject({ ...issueNoteSchema.entries, anchor: anchorSchema }),
]);
