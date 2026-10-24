import * as v from "valibot";
import type ReviewState from "./ReviewState.ts";
import reviewStateSchema from "./reviewStateSchema.ts";

/** Parses imported review state; `null` when it is invalid. */
export default function parseReviewState(
  json: string | null,
): ReviewState | null {
  if (json === null) {
    return null;
  }
  try {
    const result = v.safeParse(reviewStateSchema, JSON.parse(json));
    return result.success ? result.output : null;
  } catch {
    return null;
  }
}
