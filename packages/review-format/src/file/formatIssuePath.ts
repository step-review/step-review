import type * as v from "valibot";

/** Formats a Valibot issue path as `steps[0].files[1].path`. */
export default function formatIssuePath(
  path: v.BaseIssue<unknown>["path"],
): string {
  let formatted = "";
  for (const item of path ?? []) {
    const key: unknown = item.key;
    if (typeof key === "number") {
      formatted += `[${key}]`;
    } else {
      formatted += `${formatted ? "." : ""}${String(key)}`;
    }
  }
  return formatted;
}
