export default interface ReleasePlan {
  version: string;
  /** The dist-tag the version is published under. */
  channel: string;
  commit: string;
  /** Set for branch betas, absent for stable releases. */
  branch?: string;
}
