import type NavigableRoute from "./NavigableRoute.ts";
import RouteName from "./RouteName.ts";

export default function routeHref(route: NavigableRoute): string {
  switch (route.name) {
    case RouteName.Start:
      return "/";
    case RouteName.Overview:
      return `/r/${encodeURIComponent(route.reviewId)}/overview`;
    case RouteName.Step:
      return `/r/${encodeURIComponent(route.reviewId)}/steps/${encodeURIComponent(route.stepId)}`;
  }
}
