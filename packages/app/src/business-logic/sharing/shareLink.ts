import routeHref from "../navigation/routeHref.ts";
import RouteName from "../navigation/RouteName.ts";
import type ShareBookmark from "../share-store/ShareBookmark.ts";

/** The link to a share's overview, holding the key that decrypts it. */
export default function shareLink(
  appOrigin: string,
  { shareId, shareKey }: ShareBookmark,
): string {
  return new URL(
    routeHref({
      name: RouteName.Overview,
      reviewAddress: { kind: "shared", shareId, shareKey },
    }),
    appOrigin,
  ).href;
}
