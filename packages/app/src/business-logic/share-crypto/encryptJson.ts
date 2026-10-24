import encodeBase64Url from "./encodeBase64Url.ts";
import encryptEnvelope from "./encryptEnvelope.ts";

/** Encrypts a value as JSON, into base64url text for the share protocol. */
export default async function encryptJson(
  shareKey: CryptoKey,
  value: unknown,
  additionalData: string,
): Promise<string> {
  return encodeBase64Url(
    await encryptEnvelope(
      shareKey,
      new TextEncoder().encode(JSON.stringify(value)),
      additionalData,
    ),
  );
}
