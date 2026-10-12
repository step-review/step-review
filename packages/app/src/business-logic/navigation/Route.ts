import type RouteName from "./RouteName.ts";

type Route =
  | { name: typeof RouteName.Start }
  | { name: typeof RouteName.Overview; roundNumber: number }
  | { name: typeof RouteName.Step; roundNumber: number; stepId: string }
  | { name: typeof RouteName.NotFound };

export default Route;
