import type * as v from "valibot";
import type stepNoteSchema from "../schemas/stepNoteSchema.ts";

type StepNote = v.InferOutput<typeof stepNoteSchema>;

export default StepNote;
