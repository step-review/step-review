/* oxlint-disable architecture/public-exports -- The Worker's module exports its Durable Object class by name. */
import type Env from "./Env.ts";
import handleShareRequest from "./handleShareRequest.ts";
import ShareObject from "./ShareObject.ts";

export { ShareObject };

/**
 * The share API. In production the same Worker serves the app's static assets,
 * and only gets the requests under `/api/`.
 */
export default {
  fetch: (request, env) => handleShareRequest(request, env),
} satisfies ExportedHandler<Env>;
