import { inject } from "vitest";

/** Sends a request to the share server started for the tests. */
export default function shareServerFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(new URL(path, inject("shareServerOrigin")), init);
}
