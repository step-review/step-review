import type Route from "./Route.ts";
import RouteName from "./RouteName.ts";

export default function parseRoute(pathname: string): Route {
  const normalizedPathname = pathname.replace(/\/+$/u, "") || "/";
  if (normalizedPathname === "/") {
    return { name: RouteName.Start };
  }
  if (normalizedPathname === "/overview") {
    return { name: RouteName.Overview };
  }
  const match = /^\/steps\/([^/]+)$/u.exec(normalizedPathname);
  if (!match) {
    return { name: RouteName.NotFound };
  }
  return { name: RouteName.Step, stepId: decodeURIComponent(match[1]!) };
}
