/** Compares two `X.Y.Z` versions: negative if `a` is older than `b`. */
export default function compareVersions(a: string, b: string): number {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);
  for (const [index, aPart] of aParts.entries()) {
    const difference = aPart - (bParts[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}
