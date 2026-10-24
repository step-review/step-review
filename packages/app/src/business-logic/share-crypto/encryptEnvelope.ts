import envelopeFormatVersion from "./envelopeFormatVersion.ts";

const ivBytes = 12;

/**
 * Encrypts with AES-GCM, as the format version, a random IV and the ciphertext.
 * The additional data binds the envelope to what it is for (e.g. whose state),
 * so that the server can't pass it off as something else.
 */
export default async function encryptEnvelope(
  shareKey: CryptoKey,
  plaintext: Uint8Array<ArrayBuffer>,
  additionalData: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const iv = crypto.getRandomValues(new Uint8Array(ivBytes));
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: new TextEncoder().encode(additionalData),
    },
    shareKey,
    plaintext,
  );
  const envelope = new Uint8Array(1 + ivBytes + ciphertext.byteLength);
  envelope[0] = envelopeFormatVersion;
  envelope.set(iv, 1);
  envelope.set(new Uint8Array(ciphertext), 1 + ivBytes);
  return envelope;
}
