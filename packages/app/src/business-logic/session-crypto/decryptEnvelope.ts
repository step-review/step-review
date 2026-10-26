import envelopeFormatVersion from "./envelopeFormatVersion.ts";
import envelopeIvBytes from "./envelopeIvBytes.ts";

/**
 * Decrypts an envelope made by `encryptEnvelope`. `null` when it can't be:
 * another key, other additional data, or altered bytes.
 */
export default async function decryptEnvelope(
  sessionKey: CryptoKey,
  envelope: Uint8Array<ArrayBuffer>,
  additionalData: string,
): Promise<Uint8Array<ArrayBuffer> | null> {
  if (envelope[0] !== envelopeFormatVersion) {
    return null;
  }
  try {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: envelope.subarray(1, 1 + envelopeIvBytes),
        additionalData: new TextEncoder().encode(additionalData),
      },
      sessionKey,
      envelope.subarray(1 + envelopeIvBytes),
    );
    return new Uint8Array(plaintext);
  } catch {
    return null;
  }
}
