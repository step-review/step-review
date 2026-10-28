interface ClickEvent {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/**
 * Whether a click on a link should navigate within the app, rather than be left
 * to the browser to open the link in a new tab or window, or download it.
 */
export default function isPlainClick(event: ClickEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
