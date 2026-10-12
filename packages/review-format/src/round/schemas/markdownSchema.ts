import * as v from "valibot";

export default v.pipe(
  v.string(),
  v.minLength(1),
  v.description(
    "Markdown text. Links to `note:<id>`, `step:<id>` and `file:<path>` point to parts of the review.",
  ),
);
