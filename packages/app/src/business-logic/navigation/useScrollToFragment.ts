import { useEffect } from "react";
import useFragment from "./useFragment.ts";

/** Scrolls to the element named by the URL fragment, once it renders. */
export default function useScrollToFragment(): void {
  const fragment = useFragment();
  useEffect(() => {
    if (!fragment) {
      window.scrollTo(0, 0);
      return;
    }
    // Cards expand when the fragment targets them; wait for that render.
    const timeout = window.setTimeout(() => {
      document.getElementById(fragment)?.scrollIntoView({ block: "start" });
    }, 50);
    return () => window.clearTimeout(timeout);
  }, [fragment]);
}
