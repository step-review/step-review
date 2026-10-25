/** Whether a file of a shared review is viewed, from every participant's marks. */
export default interface FileViewedStatus {
  viewed: boolean;
  /** When the file's latest mark was made. */
  at: number;
  /**
   * The participants who marked the file viewed since it was last marked not
   * viewed.
   */
  viewerIds: string[];
}
