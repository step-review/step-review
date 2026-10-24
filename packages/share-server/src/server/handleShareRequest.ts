import type Env from "./Env.ts";
import readBearerSecret from "./readBearerSecret.ts";
import readReviewBody from "./readReviewBody.ts";

const sharePathPattern =
  /^\/api\/shares\/([\w-]{22})(?:\/(review|socket)|\/versions\/([\w-]{22}))?$/u;

/**
 * The share API: `/api/shares/<shareId>` (`GET` the version to load, `DELETE`
 * by the owner), `…/review` (`PUT` by the owner, creating the share the first
 * time), `…/versions/<versionId>` (`GET`, immutable) and `…/socket`.
 */
export default async function handleShareRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const match = sharePathPattern.exec(new URL(request.url).pathname);
  if (!match) {
    return new Response(null, { status: 404 });
  }
  const [, shareId, resource, versionId] = match as unknown as [
    string,
    string,
    string | undefined,
    string | undefined,
  ];
  const shareObject = env.SHARES.getByName(shareId);
  const route = versionId ? "version" : (resource ?? "share");
  switch (`${request.method} ${route}`) {
    case "GET share": {
      const shareInfo = await shareObject.readShareInfo();
      return shareInfo
        ? Response.json(shareInfo, { headers: { "Cache-Control": "no-store" } })
        : new Response(null, { status: 404 });
    }
    case "DELETE share": {
      const ownerSecret = readBearerSecret(request);
      if (!ownerSecret) {
        return new Response(null, { status: 401 });
      }
      const outcome = await shareObject.deleteShare(ownerSecret);
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
      const shareInfo = await shareObject.saveReview(ownerSecret, review);
      return shareInfo
        ? Response.json(shareInfo)
        : new Response(null, { status: 403 });
    }
    case "GET version": {
      const review = await shareObject.readReview(versionId!);
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
        ? shareObject.fetch(request)
        : new Response(null, { status: 426 });
    default:
      return new Response(null, { status: 405 });
  }
}
