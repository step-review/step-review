import type Route from "./Route.ts";
import RouteName from "./RouteName.ts";

export default function parseRoute(pathname: string): Route {
  const normalizedPathname = pathname.replace(/\/+$/u, "") || "/";
  if (normalizedPathname === "/") {
    return { name: RouteName.Start };
  }
  const overviewMatch = /^\/r\/([^/]+)\/overview$/u.exec(normalizedPathname);
  if (overviewMatch) {
    return {
      name: RouteName.Overview,
      reviewId: decodeURIComponent(overviewMatch[1]!),
    };
  }
  const stepMatch = /^\/r\/([^/]+)\/steps\/([^/]+)$/u.exec(normalizedPathname);
  if (stepMatch) {
    return {
      name: RouteName.Step,
      reviewId: decodeURIComponent(stepMatch[1]!),
      stepId: decodeURIComponent(stepMatch[2]!),
    };
  }
  return { name: RouteName.NotFound };
}
