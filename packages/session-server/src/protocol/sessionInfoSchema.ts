import * as v from "valibot";
import idSchema from "./idSchema.ts";

/** A session as returned by the API: the version of its review to load. */
export default v.object({ versionId: idSchema });
