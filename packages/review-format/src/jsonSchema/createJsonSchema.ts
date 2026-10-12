import { toJsonSchema } from "@valibot/to-json-schema";
import reviewRoundDataSchema from "../round/schemas/reviewRoundDataSchema.ts";

/** JSON Schema of the JSON section of a review round. */
export default function createJsonSchema(schemaUrl: string) {
  return {
    ...toJsonSchema(reviewRoundDataSchema, { errorMode: "ignore" }),
    $id: schemaUrl,
  };
}
