import { useEffect } from "react";

/** Keys (`KeyboardEvent.key` values) and the handlers they trigger. */
type Hotkeys = [key: string, handler: () => void][];

/**
 * Runs a handler when its key is pressed without modifiers, unless the focus is
 * in a field, where the key edits the text.
 */
export default function useHotkeys(hotkeys: Hotkeys) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isEditable(event.target)
      ) {
        return;
      }
      const hotkey = hotkeys.find(([key]) => key === event.key);
      if (hotkey) {
        event.preventDefault();
        hotkey[1]();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hotkeys]);
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}
