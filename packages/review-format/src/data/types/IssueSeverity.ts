import type * as v from "valibot";
import type issueSeveritySchema from "../schemas/issueSeveritySchema.ts";

type IssueSeverity = v.InferOutput<typeof issueSeveritySchema>;

export default IssueSeverity;
