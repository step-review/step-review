import decodeBase64Url from "./decodeBase64Url.ts";

/**
 * The AES-GCM key of a session, from the base64url text its links hold. `null`
 * when the text isn't a key, e.g. a link cut short.
 */
export default async function importSessionKey(
  sessionKey: string,
): Promise<CryptoKey | null> {
  try {
    const keyBytes = decodeBase64Url(sessionKey);
    if (keyBytes.byteLength !== 32) {
      return null;
    }
    return await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
      "encrypt",
      "decrypt",
    ]);
  } catch {
    return null;
  }
}
