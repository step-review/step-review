import * as v from "valibot";
import diffSideSchema from "./diffSideSchema.ts";
import lineNumberSchema from "./lineNumberSchema.ts";

export default v.strictObject({
  side: diffSideSchema,
  start: lineNumberSchema,
  end: lineNumberSchema,
});
