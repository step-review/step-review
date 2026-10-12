import type * as v from "valibot";
import type fileNoteSchema from "../schemas/fileNoteSchema.ts";

type FileNote = v.InferOutput<typeof fileNoteSchema>;

export default FileNote;
