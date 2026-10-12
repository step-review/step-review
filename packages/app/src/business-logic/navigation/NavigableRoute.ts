import type Route from "./Route.ts";
import type RouteName from "./RouteName.ts";

type NavigableRoute = Exclude<Route, { name: typeof RouteName.NotFound }>;

export default NavigableRoute;
