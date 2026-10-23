import { toJsonSchema } from "@valibot/to-json-schema";
import reviewDataSchema from "../data/schemas/reviewDataSchema.ts";

/** JSON Schema of the JSON section of a review file. */
export default function createJsonSchema(schemaUrl: string) {
  return {
    ...toJsonSchema(reviewDataSchema, { errorMode: "ignore" }),
    $id: schemaUrl,
  };
}
