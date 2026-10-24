import * as v from "valibot";
import identifierSchema from "./identifierSchema.ts";

export default v.pipe(
  identifierSchema,
  v.description("Unique within the review, e.g. `n12`."),
);
