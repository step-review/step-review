import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

/** The decoded URL fragment, without `#`. */
export default function useFragment(): string {
  return useSyncExternalStore(subscribe, () =>
    decodeURIComponent(window.location.hash.slice(1)),
  );
}
