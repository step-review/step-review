import type SessionObject from "./SessionObject.ts";

/** The bindings declared in `wrangler.json`. */
export default interface Env {
  SESSIONS: DurableObjectNamespace<SessionObject>;
  REVIEW_UPLOADS: RateLimit;
}
