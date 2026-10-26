import { parseArgs } from "node:util";
import shell from "./shell.ts";

const domain = "step-review.dev";

/** Prints `<tag> <commit>` for each `vX.Y.Z` tag. */
const releaseTagsQuery = String.raw`.[] | select(.name | test("^v[0-9]+[.][0-9]+[.][0-9]+$")) | "\(.name) \(.commit.sha)"`;

/** Where a build is deployed: production (`--production`) or a PR preview. */
export default class DeployTarget {
  pullRequestNumber: string | undefined;
  workerName: string;
  hostname: string;

  constructor(argumentsList: string[]) {
    const { values } = parseArgs({
      args: argumentsList,
      options: {
        production: { type: "boolean" },
        pr: { type: "string" },
      },
      allowPositionals: false,
      strict: true,
    });
    if (
      !(values.production === true && values.pr === undefined) &&
      !(
        values.production === undefined &&
        values.pr !== undefined &&
        /^[1-9]\d{0,9}$/u.test(values.pr)
      )
    ) {
      throw new Error(
        "Choose exactly one target: --production or --pr <number>.",
      );
    }
    this.pullRequestNumber = values.pr;
    this.workerName = values.pr ? `step-review-pr-${values.pr}` : "step-review";
    this.hostname = values.pr ? `pr-${values.pr}.${domain}` : domain;
  }

  /**
   * Whether the revision being deployed is still the latest one for the target.
   * Outside GitHub Actions there is nothing to compare with.
   */
  async isCurrent(action: "deploy" | "cleanup"): Promise<boolean> {
    if (action === "cleanup" && !this.pullRequestNumber) {
      throw new Error("Removing the production deployment is forbidden.");
    }
    if (action === "deploy" && !process.env["GITHUB_ACTIONS"]) {
      return true;
    }
    const repository = required("GITHUB_REPOSITORY");
    if (!this.pullRequestNumber) {
      return (
        (await latestReleaseCommit(repository)) === required("DEPLOY_REVISION")
      );
    }
    const endpoint = `repos/${repository}/pulls/${this.pullRequestNumber}`;
    const pullRequest = JSON.parse(
      (await shell`gh api ${endpoint}`).stdout,
    ) as {
      state: string;
      head: { sha: string; repo: { full_name: string } | null };
    };
    return (
      pullRequest.head.repo?.full_name === repository &&
      (action === "cleanup"
        ? pullRequest.state === "closed"
        : pullRequest.state === "open" &&
          pullRequest.head.sha === required("DEPLOY_REVISION"))
    );
  }
}

/** The commit of the highest `vX.Y.Z` tag: production runs the latest release. */
async function latestReleaseCommit(
  repository: string,
): Promise<string | undefined> {
  const endpoint = `repos/${repository}/tags`;
  const releaseTags = (
    await shell`gh api ${endpoint} --paginate --jq ${releaseTagsQuery}`
  ).stdout
    .trim()
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => {
      const [name = "", commit = ""] = line.split(" ");
      return { version: name.slice(1), commit };
    })
    .sort((a, b) =>
      b.version.localeCompare(a.version, "en", { numeric: true }),
    );
  return releaseTags[0]?.commit;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}
