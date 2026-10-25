import type Env from "./Env.ts";
import readBearerSecret from "./readBearerSecret.ts";
import readReviewBody from "./readReviewBody.ts";

const sessionPathPattern =
  /^\/api\/sessions\/([\w-]{22})(?:\/(review|socket)|\/versions\/([\w-]{22}))?$/u;

/**
 * The session API: `/api/sessions/<sessionId>` (`GET` the version to load,
 * `DELETE` by the owner), `…/review` (`PUT` by the owner, creating the session
 * the first time), `…/versions/<versionId>` (`GET`, immutable) and `…/socket`.
 */
export default async function handleSessionRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const match = sessionPathPattern.exec(new URL(request.url).pathname);
  if (!match) {
    return new Response(null, { status: 404 });
  }
  const [, sessionId, resource, versionId] = match as unknown as [
    string,
    string,
    string | undefined,
    string | undefined,
  ];
  const sessionObject = env.SESSIONS.getByName(sessionId);
  const route = versionId ? "version" : (resource ?? "session");
  switch (`${request.method} ${route}`) {
    case "GET session": {
      const sessionInfo = await sessionObject.readSessionInfo();
      return sessionInfo
        ? Response.json(sessionInfo, {
            headers: { "Cache-Control": "no-store" },
          })
        : new Response(null, { status: 404 });
    }
    case "DELETE session": {
      const ownerSecret = readBearerSecret(request);
      if (!ownerSecret) {
        return new Response(null, { status: 401 });
      }
      const outcome = await sessionObject.deleteSession(ownerSecret);
      return new Response(null, {
        status: { deleted: 204, forbidden: 403, notFound: 404 }[outcome],
      });
    }
    case "PUT review": {
      const ownerSecret = readBearerSecret(request);
      if (!ownerSecret) {
        return new Response(null, { status: 401 });
      }
      const { success } = await env.REVIEW_UPLOADS.limit({
        key: request.headers.get("CF-Connecting-IP") ?? "unknown",
      });
      if (!success) {
        return new Response(null, { status: 429 });
      }
      const review = await readReviewBody(request);
      if (!review) {
        return new Response(null, { status: 413 });
      }
      const sessionInfo = await sessionObject.saveReview(ownerSecret, review);
      return sessionInfo
        ? Response.json(sessionInfo)
        : new Response(null, { status: 403 });
    }
    case "GET version": {
      const review = await sessionObject.readReview(versionId!);
      return review
        ? new Response(review, {
            headers: {
              "Content-Type": "application/octet-stream",
              // Versions never change: a new one gets a new ID.
              "Cache-Control": "private, max-age=31536000, immutable",
            },
          })
        : new Response(null, { status: 404 });
    }
    case "GET socket":
      return request.headers.get("Upgrade") === "websocket"
        ? sessionObject.fetch(request)
        : new Response(null, { status: 426 });
    default:
      return new Response(null, { status: 405 });
  }
}
