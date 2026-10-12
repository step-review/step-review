import { parseArgs } from "node:util";
import shell from "./shell.ts";

const domain = "step-review.dev";

/** Where a build is deployed: production (`--main`) or a PR preview. */
export default class DeployTarget {
  pullRequestNumber: string | undefined;
  workerName: string;
  hostname: string;

  constructor(argumentsList: string[]) {
    const { values } = parseArgs({
      args: argumentsList,
      options: {
        main: { type: "boolean" },
        pr: { type: "string" },
      },
      allowPositionals: false,
      strict: true,
    });
    if (
      !(values.main === true && values.pr === undefined) &&
      !(
        values.main === undefined &&
        values.pr !== undefined &&
        /^[1-9]\d{0,9}$/u.test(values.pr)
      )
    ) {
      throw new Error("Choose exactly one target: --main or --pr <number>.");
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
      const endpoint = `repos/${repository}/commits/main`;
      return (
        (await shell`gh api ${endpoint} --jq .sha`).stdout.trim() ===
        required("DEPLOY_REVISION")
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

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}
