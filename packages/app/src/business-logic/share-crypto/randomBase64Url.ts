import encodeBase64Url from "./encodeBase64Url.ts";

/**
 * Random bytes in base64url: 16 for IDs, 32 for keys and secrets, as the share
 * protocol expects.
 */
export default function randomBase64Url(byteCount: 16 | 32): string {
  return encodeBase64Url(crypto.getRandomValues(new Uint8Array(byteCount)));
}
