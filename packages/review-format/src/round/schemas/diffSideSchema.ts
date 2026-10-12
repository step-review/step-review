import * as v from "valibot";

export default v.pipe(
  v.picklist(["old", "new"]),
  v.description(
    "`new` for lines in the head version (added or context lines), `old` for lines in the base version (deleted lines).",
  ),
);
