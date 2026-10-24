import type RouteName from "./RouteName.ts";

type Route =
  | { name: typeof RouteName.Start }
  | { name: typeof RouteName.Overview; reviewId: string }
  | { name: typeof RouteName.Step; reviewId: string; stepId: string }
  | { name: typeof RouteName.NotFound };

export default Route;
