import * as v from "valibot";
import decodeBase64Url from "./decodeBase64Url.ts";
import decryptEnvelope from "./decryptEnvelope.ts";

/**
 * Decrypts a value made by `encryptJson`. `null` when it can't be decrypted or
 * doesn't match the schema: other participants wrote it, so it is untrusted.
 */
export default async function decryptJson<
  Schema extends v.GenericSchema<unknown>,
>(
  shareKey: CryptoKey,
  encryptedJson: string,
  additionalData: string,
  schema: Schema,
): Promise<v.InferOutput<Schema> | null> {
  try {
    const plaintext = await decryptEnvelope(
      shareKey,
      decodeBase64Url(encryptedJson),
      additionalData,
    );
    if (!plaintext) {
      return null;
    }
    const result = v.safeParse(
      schema,
      JSON.parse(new TextDecoder().decode(plaintext)),
    );
    return result.success ? result.output : null;
  } catch {
    return null;
  }
}
