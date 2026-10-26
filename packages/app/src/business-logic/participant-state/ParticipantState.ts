import type * as v from "valibot";
import type participantStateSchema from "./participantStateSchema.ts";

type ParticipantState = v.InferOutput<typeof participantStateSchema>;

export default ParticipantState;
