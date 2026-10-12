import { useMemo, useSyncExternalStore } from "react";
import parseRoute from "./parseRoute.ts";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

export default function useNavigationState() {
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
  );
  return useMemo(() => parseRoute(pathname), [pathname]);
}
