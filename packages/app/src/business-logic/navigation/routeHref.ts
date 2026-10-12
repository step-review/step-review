import type NavigableRoute from "./NavigableRoute.ts";
import RouteName from "./RouteName.ts";

export default function routeHref(route: NavigableRoute): string {
  switch (route.name) {
    case RouteName.Start:
      return "/";
    case RouteName.Overview:
      return `/rounds/${route.roundNumber}`;
    case RouteName.Step:
      return `/rounds/${route.roundNumber}/steps/${encodeURIComponent(route.stepId)}`;
  }
}
