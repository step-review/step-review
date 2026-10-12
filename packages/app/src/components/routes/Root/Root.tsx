import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useNavigationState from "../../../business-logic/navigation/useNavigationState.ts";
import NotFound from "../NotFound/NotFound.tsx";
import Overview from "../Overview/Overview.tsx";
import Start from "../Start/Start.tsx";
import Step from "../Step/Step.tsx";

export default function Root() {
  const route = useNavigationState();
  switch (route.name) {
    case RouteName.Start:
      return <Start />;
    case RouteName.Overview:
      return (
        <Overview key={route.roundNumber} roundNumber={route.roundNumber} />
      );
    case RouteName.Step:
      return (
        <Step
          key={`${route.roundNumber}/${route.stepId}`}
          roundNumber={route.roundNumber}
          stepId={route.stepId}
        />
      );
    default:
      return <NotFound />;
  }
}
