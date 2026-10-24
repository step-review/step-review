import type ShareObject from "./ShareObject.ts";

/** The bindings declared in `wrangler.json`. */
export default interface Env {
  SHARES: DurableObjectNamespace<ShareObject>;
  REVIEW_UPLOADS: RateLimit;
}
