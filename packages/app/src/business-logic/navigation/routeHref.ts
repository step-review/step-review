import type NavigableRoute from "./NavigableRoute.ts";
import type ReviewAddress from "./ReviewAddress.ts";
import RouteName from "./RouteName.ts";

/**
 * The URL of a route, scrolling to the element whose ID is the fragment, if
 * any. See `parseLocation`.
 */
export default function routeHref(
  route: NavigableRoute,
  fragment?: string | null,
): string {
  switch (route.name) {
    case RouteName.Start:
      return "/";
    case RouteName.Overview:
      return `${reviewPath(route.reviewAddress)}/overview${reviewHash(route.reviewAddress, fragment)}`;
    case RouteName.Step:
      return `${reviewPath(route.reviewAddress)}/steps/${encodeURIComponent(route.stepId)}${reviewHash(route.reviewAddress, fragment)}`;
  }
}

function reviewPath(reviewAddress: ReviewAddress): string {
  return reviewAddress.kind === "local"
    ? `/r/${encodeURIComponent(reviewAddress.reviewId)}`
    : `/s/${encodeURIComponent(reviewAddress.shareId)}`;
}

function reviewHash(
  reviewAddress: ReviewAddress,
  fragment: string | null | undefined,
): string {
  if (reviewAddress.kind === "local") {
    return fragment ? `#${encodeURIComponent(fragment)}` : "";
  }
  const hashParameters = new URLSearchParams();
  if (reviewAddress.shareKey !== null) {
    hashParameters.set("key", reviewAddress.shareKey);
  }
  if (fragment) {
    hashParameters.set("to", fragment);
  }
  const hash = hashParameters.toString();
  return hash ? `#${hash}` : "";
}
