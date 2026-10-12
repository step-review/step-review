import * as v from "valibot";
import identifierSchema from "./identifierSchema.ts";

export default v.pipe(
  identifierSchema,
  v.description("Unique across every round of the review file, e.g. `n12`."),
);
