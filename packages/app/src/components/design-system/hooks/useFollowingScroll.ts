import { useEffect, useRef } from "react";
import revealingScrollTop from "./revealingScrollTop.ts";

/** Keeps an item off the scroll area's faded edges, with its neighbor showing. */
const followingMargin = 48;

/**
 * Scrolls the element with the given ID into view within its scroll area as the
 * ID changes, as long as the user follows along: not when they scrolled the
 * previous element out of view, to look elsewhere. Following resumes once the
 * current element is in view again. Never scrolls the page itself.
 */
export default function useFollowingScroll(elementId: string | null): void {
  const followedElementIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (elementId === null) {
      return;
    }
    const followedElementId = followedElementIdRef.current;
    followedElementIdRef.current = elementId;
    const element = document.getElementById(elementId);
    const scrollArea = element && closestScrollArea(element);
    // Not rendered, e.g. in a collapsed folder, nothing to scroll to.
    if (!element || !scrollArea || element.getClientRects().length === 0) {
      return;
    }
    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const followedElement =
      followedElementId === null
        ? null
        : document.getElementById(followedElementId);
    // A followed element that isn't rendered can't have been scrolled away.
    if (followedElement && followedElement.getClientRects().length > 0) {
      const followedElementRect = followedElement.getBoundingClientRect();
      const isFollowedElementInView =
        followedElementRect.bottom > scrollAreaRect.top &&
        followedElementRect.top < scrollAreaRect.bottom;
      if (!isFollowedElementInView) {
        return;
      }
    }
    const top = revealingScrollTop(
      element.getBoundingClientRect(),
      scrollAreaRect,
      scrollArea.scrollTop,
      followingMargin,
    );
    if (top !== scrollArea.scrollTop) {
      scrollArea.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }, [elementId]);
}

/**
 * The nearest ancestor that scrolls the element, short of the page: `null`
 * where the page itself scrolls it, e.g. a sidebar stacked above the content.
 */
function closestScrollArea(element: HTMLElement): HTMLElement | null {
  for (
    let ancestor = element.parentElement;
    ancestor && ancestor !== document.scrollingElement;
    ancestor = ancestor.parentElement
  ) {
    const { overflowY } = getComputedStyle(ancestor);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      ancestor.scrollHeight > ancestor.clientHeight
    ) {
      return ancestor;
    }
  }
  return null;
}
