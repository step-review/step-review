type FragmentScrollListener = (fragment: string) => void;

/**
 * Scrolls to the elements that URL fragments name, telling listeners once the
 * page is there, e.g. to know which file it went to after a scroll that
 * couldn't bring the file's card to the top.
 */
export default class FragmentScroll {
  private static listeners = new Set<FragmentScrollListener>();

  static scrollTo(fragment: string): void {
    const element = document.getElementById(fragment);
    if (!element) {
      return;
    }
    // Instant, so that the page is already there for the listeners.
    element.scrollIntoView({ block: "start" });
    for (const listener of FragmentScroll.listeners) {
      listener(fragment);
    }
  }

  /** Returns the function that stops listening. */
  static listen(listener: FragmentScrollListener): () => void {
    FragmentScroll.listeners.add(listener);
    return () => FragmentScroll.listeners.delete(listener);
  }
}
