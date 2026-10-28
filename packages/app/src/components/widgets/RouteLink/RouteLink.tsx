import type { ComponentPropsWithRef } from "react";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";

interface Props extends Omit<ComponentPropsWithRef<"a">, "href"> {
  route: NavigableRoute;
  /** The ID of the element to scroll to, e.g. a note. */
  fragment?: string;
  /**
   * Called after navigating within the app, not when the browser opens the
   * link, e.g. in a new tab.
   */
  onNavigate?: () => void;
}

/**
 * A link to a route of the app. A plain click navigates within the app, while
 * the browser handles the others, e.g. opening the link in a new tab on a click
 * with a modifier key. Render Primer's links as it with their `as` prop.
 */
export default function RouteLink({
  route,
  fragment,
  onNavigate,
  onClick,
  ...anchorProps
}: Props) {
  return (
    <a
      {...anchorProps}
      href={routeHref(route, fragment)}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigateTo(route, fragment);
        onNavigate?.();
      }}
    />
  );
}
