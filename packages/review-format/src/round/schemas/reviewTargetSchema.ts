import * as v from "valibot";
import commitSchema from "./commitSchema.ts";

export default v.strictObject({
  title: v.pipe(
    v.string(),
    v.minLength(1),
    v.description("The PR title, or a short description of the changes."),
  ),
  url: v.optional(
    v.pipe(v.string(), v.url(), v.description("Link to the PR, if any.")),
  ),
  baseRef: v.optional(
    v.pipe(v.string(), v.description("Base branch name, e.g. `main`.")),
  ),
  headRef: v.optional(v.pipe(v.string(), v.description("Head branch name."))),
  baseCommit: v.pipe(
    commitSchema,
    v.description("Commit the diff starts from (the merge base)."),
  ),
  headCommit: v.pipe(commitSchema, v.description("Commit the diff ends at.")),
});
