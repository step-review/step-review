import { useMemo, useSyncExternalStore } from "react";
import parseLocation from "./parseLocation.ts";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

/** The current route and fragment. */
export default function useLocationParts() {
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
  );
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return useMemo(() => parseLocation(pathname, hash), [pathname, hash]);
}
