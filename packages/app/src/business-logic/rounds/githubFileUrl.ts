import type { ReviewTarget } from "@step-review/review-format";

/** Link to a file at the head commit on GitHub, for GitHub PRs. */
export default function githubFileUrl(
  reviewTarget: ReviewTarget,
  path: string,
): string | null {
  const repository = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+/u.exec(
    reviewTarget.url ?? "",
  )?.[1];
  if (!repository) {
    return null;
  }
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/${repository}/blob/${reviewTarget.headCommit}/${encodedPath}`;
}
