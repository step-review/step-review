import type Env from "./Env.ts";
import readBearerSecret from "./readBearerSecret.ts";
import readReviewBody from "./readReviewBody.ts";

const sessionPathPattern =
  /^\/api\/sessions\/([\w-]{22})(?:\/(review|socket))?$/u;

/**
 * The session API: `/api/sessions/<sessionId>` (`GET` whether it exists,
 * `DELETE` by the owner), `…/review` (`PUT` by the owner, creating the session,
 * then `GET`, immutable) and `…/socket`.
 */
export default async function handleSessionRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const match = sessionPathPattern.exec(new URL(request.url).pathname);
  if (!match) {
    return new Response(null, { status: 404 });
  }
  const [, sessionId, resource] = match as unknown as [
    string,
    string,
    string | undefined,
  ];
  const sessionObject = env.SESSIONS.getByName(sessionId);
  switch (`${request.method} ${resource ?? "session"}`) {
    case "GET session":
      return new Response(null, {
        status: (await sessionObject.exists()) ? 204 : 404,
        headers: { "Cache-Control": "no-store" },
      });
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
      return new Response(null, {
        status: (await sessionObject.create(ownerSecret, review)) ? 201 : 409,
      });
    }
    case "GET review": {
      const review = await sessionObject.readReview();
      return review
        ? new Response(review, {
            headers: {
              "Content-Type": "application/octet-stream",
              // A session's review never changes, and its ID is never reused.
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
