import * as v from "valibot";

export default v.pipe(
  v.string(),
  v.regex(
    /^[A-Za-z0-9][A-Za-z0-9_-]*$/u,
    "Use letters, digits, `-` and `_`, starting with a letter or digit.",
  ),
);
