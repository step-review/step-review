import type NavigableRoute from "./NavigableRoute.ts";
import routeHref from "./routeHref.ts";

/**
 * Navigates to a route. The fragment, if any, is the ID of the element to
 * scroll to, e.g. a note.
 */
export default function navigateTo(
  route: NavigableRoute,
  fragment?: string,
  { replace = false } = {},
) {
  const href = routeHref(route, fragment);
  if (`${window.location.pathname}${window.location.hash}` !== href) {
    if (replace) {
      window.history.replaceState(window.history.state, "", href);
    } else {
      window.history.pushState(window.history.state, "", href);
    }
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
