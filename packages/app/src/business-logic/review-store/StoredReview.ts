/** A review kept in the browser, as listed on the start page. */
export default interface StoredReview {
  reviewId: string;
  title: string;
  fileName: string;
  /** When the review file was last opened, in milliseconds since the epoch. */
  openedAt: number;
}
