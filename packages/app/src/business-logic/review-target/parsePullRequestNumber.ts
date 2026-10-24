/**
 * The number of the PR at the URL, for GitHub, GitLab and Bitbucket URLs;
 * otherwise `null`.
 */
export default function parsePullRequestNumber(url: string): number | null {
  const match =
    /\/(?:pull|merge_requests|pull-requests)\/(\d+)(?:[/?#]|$)/.exec(url);
  return match ? Number(match[1]) : null;
}
