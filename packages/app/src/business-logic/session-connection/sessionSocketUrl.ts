import { sessionApiPaths } from "@step-review/session-server";

export default function sessionSocketUrl(
  apiOrigin: string,
  sessionId: string,
): URL {
  const url = new URL(sessionApiPaths.socket(sessionId), apiOrigin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url;
}
