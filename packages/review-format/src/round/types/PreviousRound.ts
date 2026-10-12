import type * as v from "valibot";
import type previousRoundSchema from "../schemas/previousRoundSchema.ts";

type PreviousRound = v.InferOutput<typeof previousRoundSchema>;

export default PreviousRound;
