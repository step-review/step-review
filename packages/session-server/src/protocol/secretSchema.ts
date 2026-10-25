import * as v from "valibot";

/** A random secret (owner, participant): 32 bytes in base64url. */
export default v.pipe(v.string(), v.regex(/^[\w-]{43}$/u));
