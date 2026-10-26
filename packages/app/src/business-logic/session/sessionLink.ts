import routeHref from "../navigation/routeHref.ts";
import RouteName from "../navigation/RouteName.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";

/** The link to a session's overview, holding the key that decrypts it. */
export default function sessionLink(
  appOrigin: string,
  { sessionId, sessionKey }: SessionBookmark,
): string {
  return new URL(
    routeHref({
      name: RouteName.Overview,
      reviewAddress: { kind: "session", sessionId, sessionKey },
    }),
    appOrigin,
  ).href;
}
