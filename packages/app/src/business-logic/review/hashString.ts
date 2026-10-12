/**
 * Fast, non-cryptographic 53-bit hash (cyrb53), as 14 hex digits. Used for
 * fingerprints and storage keys, where collisions only cost a wrong "viewed"
 * state.
 */
export default function hashString(text: string): string {
  let first = 0xdeadbeef;
  let second = 0x41c6ce57;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    first = Math.imul(first ^ code, 2654435761);
    second = Math.imul(second ^ code, 1597334677);
  }
  first =
    Math.imul(first ^ (first >>> 16), 2246822507) ^
    Math.imul(second ^ (second >>> 13), 3266489909);
  second =
    Math.imul(second ^ (second >>> 16), 2246822507) ^
    Math.imul(first ^ (first >>> 13), 3266489909);
  const hash = 4294967296 * (2097151 & second) + (first >>> 0);
  return hash.toString(16).padStart(14, "0");
}
