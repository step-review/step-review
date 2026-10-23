import type * as v from "valibot";
import type reviewOverviewSchema from "../schemas/reviewOverviewSchema.ts";

type ReviewOverview = v.InferOutput<typeof reviewOverviewSchema>;

export default ReviewOverview;
