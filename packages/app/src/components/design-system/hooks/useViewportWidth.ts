import { useSyncExternalStore } from "react";

/** The viewport's width, as media queries measure it. */
export default function useViewportWidth(): number {
  return useSyncExternalStore(subscribe, () => window.innerWidth);
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
