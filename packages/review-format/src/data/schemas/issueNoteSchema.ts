import * as v from "valibot";
import issueSeveritySchema from "./issueSeveritySchema.ts";
import markdownSchema from "./markdownSchema.ts";
import noteIdSchema from "./noteIdSchema.ts";

export default v.strictObject({
  id: noteIdSchema,
  kind: v.pipe(
    v.literal("issue"),
    v.description("Something the reviewer should check or act on."),
  ),
  severity: issueSeveritySchema,
  body: markdownSchema,
});
