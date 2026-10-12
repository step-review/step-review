import type Route from "./Route.ts";
import RouteName from "./RouteName.ts";

export default function parseRoute(pathname: string): Route {
  const normalizedPathname = pathname.replace(/\/+$/u, "") || "/";
  if (normalizedPathname === "/") {
    return { name: RouteName.Start };
  }
  const match = /^\/rounds\/([1-9]\d{0,3})(?:\/steps\/([^/]+))?$/u.exec(
    normalizedPathname,
  );
  if (!match) {
    return { name: RouteName.NotFound };
  }
  const roundNumber = Number(match[1]);
  if (match[2] === undefined) {
    return { name: RouteName.Overview, roundNumber };
  }
  return {
    name: RouteName.Step,
    roundNumber,
    stepId: decodeURIComponent(match[2]),
  };
}
