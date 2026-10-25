import * as v from "valibot";

/** A random ID (session, participant, connection): 16 bytes in base64url. */
export default v.pipe(v.string(), v.regex(/^[\w-]{22}$/u));
