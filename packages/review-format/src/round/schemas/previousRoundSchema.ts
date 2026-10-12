import * as v from "valibot";
import markdownSchema from "./markdownSchema.ts";
import noteIdSchema from "./noteIdSchema.ts";

export default v.pipe(
  v.strictObject({
    changes: v.pipe(
      v.array(markdownSchema),
      v.description("What changed in the PR since the previous round."),
    ),
    issues: v.pipe(
      v.array(
        v.strictObject({
          noteId: v.pipe(
            noteIdSchema,
            v.description("ID of an issue note from a previous round."),
          ),
          status: v.picklist(["resolved", "open", "obsolete"]),
          comment: v.optional(markdownSchema),
        }),
      ),
      v.description("Status of every issue raised in previous rounds."),
    ),
  }),
  v.description("Required in every round after the first."),
);
