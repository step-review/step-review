import type RouteName from "./RouteName.ts";

type Route =
  | { name: typeof RouteName.Start }
  | { name: typeof RouteName.Overview }
  | { name: typeof RouteName.Step; stepId: string }
  | { name: typeof RouteName.NotFound };

export default Route;
