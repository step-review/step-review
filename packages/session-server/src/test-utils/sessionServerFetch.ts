import { inject } from "vitest";

/** Sends a request to the session server started for the tests. */
export default function sessionServerFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(new URL(path, inject("sessionServerOrigin")), init);
}
