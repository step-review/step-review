import type ReviewAddress from "./ReviewAddress.ts";
import type Route from "./Route.ts";
import RouteName from "./RouteName.ts";

/** The address of the review a route shows, if any. */
export default function routeReviewAddress(route: Route): ReviewAddress | null {
  return route.name === RouteName.Overview || route.name === RouteName.Step
    ? route.reviewAddress
    : null;
}
