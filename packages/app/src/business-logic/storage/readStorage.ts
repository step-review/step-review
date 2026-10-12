export default function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Storage can be unavailable (e.g. blocked site data): start empty.
    return null;
  }
}
