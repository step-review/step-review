import { shareApiPaths } from "@step-review/share-server";

export default function shareSocketUrl(
  apiOrigin: string,
  shareId: string,
): URL {
  const url = new URL(shareApiPaths.socket(shareId), apiOrigin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url;
}
