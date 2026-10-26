/**
 * The text to show for a link to the review target: `owner/repo #number` for
 * GitHub PRs, otherwise the URL itself.
 */
export default function formatTargetUrl(url: string): string {
  const { hostname, pathname } = new URL(url);
  const match = /^\/([^/]+)\/([^/]+)\/pull\/(\d+)(?:\/|$)/.exec(pathname);
  return hostname === "github.com" && match
    ? `${match[1]}/${match[2]} #${match[3]}`
    : url;
}
