import * as v from "valibot";

export default v.pipe(
  v.string(),
  v.regex(/^[0-9a-f]{7,64}$/u, "Use a commit hash."),
);
