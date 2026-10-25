import * as v from "valibot";
import secretSchema from "../protocol/secretSchema.ts";

/** The secret of an `Authorization: Bearer <secret>` header, if valid. */
export default function readBearerSecret(request: Request): string | null {
  const match = /^Bearer (.+)$/u.exec(
    request.headers.get("Authorization") ?? "",
  );
  return match && v.is(secretSchema, match[1]) ? match[1] : null;
}
