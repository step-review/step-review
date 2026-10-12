import * as v from "valibot";
import explainerNoteSchema from "./explainerNoteSchema.ts";
import issueNoteSchema from "./issueNoteSchema.ts";

export default v.variant("kind", [explainerNoteSchema, issueNoteSchema]);
