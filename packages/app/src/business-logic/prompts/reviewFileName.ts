/** Suggested name of the review file for a PR link, branch or range. */
export default function reviewFileName(target: string): string {
  const pullRequestNumber = /\/(?:pull|pulls|merge_requests)\/(\d+)/u.exec(
    target,
  )?.[1];
  if (pullRequestNumber) {
    return `pr-${pullRequestNumber}.step-review`;
  }
  const slug = target
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 60);
  return `${slug || "review"}.step-review`;
}
