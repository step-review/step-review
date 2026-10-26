import type ReviewAddress from "./ReviewAddress.ts";
import type RouteName from "./RouteName.ts";

type Route =
  | { name: typeof RouteName.Start }
  | { name: typeof RouteName.Privacy }
  | { name: typeof RouteName.Overview; reviewAddress: ReviewAddress }
  | {
      name: typeof RouteName.Step;
      reviewAddress: ReviewAddress;
      stepId: string;
    }
  | { name: typeof RouteName.NotFound };

export default Route;
