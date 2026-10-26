/** The tarball QA tested, which is the one published. */
export default interface SealedTarball {
  file: string;
  version: string;
  /** In the registry's `dist.integrity` format. */
  integrity: string;
}
