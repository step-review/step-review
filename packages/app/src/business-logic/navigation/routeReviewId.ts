import type Route from "./Route.ts";
import RouteName from "./RouteName.ts";

/** The ID of the review a route shows, if any. */
export default function routeReviewId(route: Route): string | null {
  return route.name === RouteName.Overview || route.name === RouteName.Step
    ? route.reviewId
    : null;
}
