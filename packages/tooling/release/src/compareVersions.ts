/** Compares two `X.Y.Z` versions: negative if `a` is older than `b`. */
export default function compareVersions(a: string, b: string): number {
  return a.localeCompare(b, "en", { numeric: true });
}
