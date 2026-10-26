import { parseArgs } from "node:util";
import type ReleasePlan from "./ReleasePlan.ts";

/**
 * `--production` releases the committed version to `latest`. `--pr <number>
 * --revision <commit>` publishes a preview of it, under the `pr-<number>`
 * dist-tag.
 */
export default function resolveReleasePlan(
  committedVersion: string,
  argumentsList: string[],
): ReleasePlan {
  if (!/^\d+\.\d+\.\d+$/u.test(committedVersion)) {
    throw new Error(
      `The committed version must be X.Y.Z, not ${committedVersion}.`,
    );
  }
  const { values } = parseArgs({
    args: argumentsList,
    options: {
      production: { type: "boolean" },
      pr: { type: "string" },
      revision: { type: "string" },
    },
    allowPositionals: false,
    strict: true,
  });
  if (
    values.production === true &&
    values.pr === undefined &&
    values.revision === undefined
  ) {
    return { version: committedVersion, channel: "latest", preview: false };
  }
  // Both values end up in the version, which npm rejects unless it's semver.
  if (
    values.production === undefined &&
    values.pr !== undefined &&
    /^[1-9]\d{0,9}$/u.test(values.pr) &&
    values.revision !== undefined &&
    /^[0-9a-f]{40}$/u.test(values.revision)
  ) {
    // Semver forbids numeric identifiers with leading zeros, which a commit
    // prefix can be: `sha` keeps it alphanumeric.
    return {
      version: `${committedVersion}-pr.${values.pr}.sha${values.revision.slice(0, 12)}`,
      channel: `pr-${values.pr}`,
      preview: true,
    };
  }
  throw new Error(
    "Choose exactly one target: --production or --pr <number> --revision <commit>.",
  );
}
