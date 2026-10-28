export default function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage can be unavailable: there is nothing to remove.
  }
}
