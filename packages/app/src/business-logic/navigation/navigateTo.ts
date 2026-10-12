import type NavigableRoute from "./NavigableRoute.ts";
import routeHref from "./routeHref.ts";

/**
 * Navigates to a route. The fragment, if any, is the ID of the element to
 * scroll to, e.g. a note.
 */
export default function navigateTo(route: NavigableRoute, fragment?: string) {
  const href = `${routeHref(route)}${fragment ? `#${encodeURIComponent(fragment)}` : ""}`;
  if (`${window.location.pathname}${window.location.hash}` !== href) {
    window.history.pushState(window.history.state, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
