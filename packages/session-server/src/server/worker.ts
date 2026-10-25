/* oxlint-disable architecture/public-exports -- The Worker's module exports its Durable Object class by name. */
import type Env from "./Env.ts";
import handleSessionRequest from "./handleSessionRequest.ts";
import SessionObject from "./SessionObject.ts";

export { SessionObject };

/**
 * The session API. In production the same Worker serves the app's static
 * assets, and only gets the requests under `/api/`.
 */
export default {
  fetch: (request, env) => handleSessionRequest(request, env),
} satisfies ExportedHandler<Env>;
