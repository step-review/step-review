import type ReviewStateAction from "../review-state/ReviewStateAction.ts";
import type FileViewedStatus from "./FileViewedStatus.ts";
import type ViewedMark from "./ViewedMark.ts";

/**
 * The marks that apply a change to a shared review's state. Each is later than
 * the file's latest mark, even when the participants' clocks disagree, so that
 * it wins.
 */
export default function viewedMarksForAction(
  reviewStateAction: ReviewStateAction,
  fileViewedStatuses: Map<string, FileViewedStatus>,
  now: number,
): ViewedMark[] {
  const mark = (fingerprint: string, viewed: boolean): ViewedMark => {
    const fileViewedStatus = fileViewedStatuses.get(fingerprint);
    return {
      fingerprint,
      viewed,
      // Other participants wrote the statuses' times: one past the largest
      // safe integer would make the own state invalid.
      at: fileViewedStatus
        ? Math.min(
            Math.max(now, fileViewedStatus.at + 1),
            Number.MAX_SAFE_INTEGER,
          )
        : now,
    };
  };
  const isViewed = (fingerprint: string) =>
    fileViewedStatuses.get(fingerprint)?.viewed ?? false;
  const viewedFingerprints = [...fileViewedStatuses.keys()].filter(isViewed);
  switch (reviewStateAction.type) {
    case "setViewed":
      return reviewStateAction.fingerprints.map((fingerprint) =>
        mark(fingerprint, reviewStateAction.viewed),
      );
    case "resetViewed":
      return viewedFingerprints.map((fingerprint) => mark(fingerprint, false));
    case "replace": {
      const replacingFingerprints = new Set(
        reviewStateAction.reviewState.viewedFingerprints,
      );
      return [...new Set([...viewedFingerprints, ...replacingFingerprints])]
        .filter(
          (fingerprint) =>
            replacingFingerprints.has(fingerprint) !== isViewed(fingerprint),
        )
        .map((fingerprint) =>
          mark(fingerprint, replacingFingerprints.has(fingerprint)),
        );
    }
  }
}
