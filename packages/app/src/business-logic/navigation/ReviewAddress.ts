/** Where a review is: kept in this browser (or the example), or shared. */
type ReviewAddress =
  | { kind: "local"; reviewId: string }
  | {
      kind: "shared";
      shareId: string;
      /** The key that decrypts the share; `null` when the URL lacks it. */
      shareKey: string | null;
    };

export default ReviewAddress;
