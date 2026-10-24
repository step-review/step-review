/** A random ID or secret in the protocol's format, of `byteCount` bytes. */
export default function randomTestId(byteCount: 16 | 32 = 16): string {
  return Buffer.from(
    crypto.getRandomValues(new Uint8Array(byteCount)),
  ).toString("base64url");
}
