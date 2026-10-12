import type * as v from "valibot";
import type previousRoundSchema from "../schemas/previousRoundSchema.ts";

type IssueStatus = v.InferOutput<
  typeof previousRoundSchema
>["issues"][number]["status"];

export default IssueStatus;
