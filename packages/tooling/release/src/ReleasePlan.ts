export default interface ReleasePlan {
  version: string;
  /** The dist-tag the version is published under. */
  channel: string;
  /** Whether the version is a PR preview rather than a release. */
  preview: boolean;
}
