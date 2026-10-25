import type ReviewAddress from "./ReviewAddress.ts";
import type Route from "./Route.ts";
import RouteName from "./RouteName.ts";

/**
 * The route and the fragment (the ID of the element to scroll to) of a URL. The
 * fragment of a session's URL also holds the session's key, so that any of its
 * URLs opens it: `#key=<key>&to=<fragment>`.
 */
export default function parseLocation(
  pathname: string,
  hash: string,
): { route: Route; fragment: string } {
  const normalizedPathname = pathname.replace(/\/+$/u, "") || "/";
  if (normalizedPathname === "/") {
    return { route: { name: RouteName.Start }, fragment: "" };
  }
  const match = /^\/([rs])\/([^/]+)(?:\/overview|\/steps\/([^/]+))$/u.exec(
    normalizedPathname,
  );
  if (!match) {
    return { route: { name: RouteName.NotFound }, fragment: "" };
  }
  const [, addressKind, addressId, stepId] = match as unknown as [
    string,
    "r" | "s",
    string,
    string | undefined,
  ];
  const hashParameters = new URLSearchParams(hash.slice(1));
  const reviewAddress: ReviewAddress =
    addressKind === "r"
      ? { kind: "local", reviewId: decodeURIComponent(addressId) }
      : {
          kind: "session",
          sessionId: decodeURIComponent(addressId),
          sessionKey: hashParameters.get("key"),
        };
  const fragment =
    addressKind === "r"
      ? decodeURIComponent(hash.slice(1))
      : (hashParameters.get("to") ?? "");
  return {
    route:
      stepId === undefined
        ? { name: RouteName.Overview, reviewAddress }
        : {
            name: RouteName.Step,
            reviewAddress,
            stepId: decodeURIComponent(stepId),
          },
    fragment,
  };
}
