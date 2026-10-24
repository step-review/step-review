import envelopeFormatVersion from "./envelopeFormatVersion.ts";

const ivBytes = 12;

/**
 * Decrypts an envelope made by `encryptEnvelope`. `null` when it can't be:
 * another key, other additional data, or altered bytes.
 */
export default async function decryptEnvelope(
  shareKey: CryptoKey,
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
        iv: envelope.subarray(1, 1 + ivBytes),
        additionalData: new TextEncoder().encode(additionalData),
      },
      shareKey,
      envelope.subarray(1 + ivBytes),
    );
    return new Uint8Array(plaintext);
  } catch {
    return null;
  }
}
