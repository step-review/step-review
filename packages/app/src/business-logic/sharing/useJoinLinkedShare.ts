import { useEffect, useState } from "react";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import joinShare from "./joinShare.ts";
import loadLinkedReview from "./loadLinkedReview.ts";

/**
 * Joins the share a link opens, unless its bookmark already holds the link's
 * key: whether the link can't open it.
 */
export default function useJoinLinkedShare(
  shareId: string,
  linkShareKey: string | null,
  shareBookmark: ShareBookmark | null | undefined,
): boolean {
  /** Set when the link's key can't open the share. */
  const [unusableShareKey, setUnusableShareKey] = useState<string | null>(null);
  useEffect(() => {
    if (
      shareBookmark === undefined ||
      linkShareKey === null ||
      shareBookmark?.shareKey === linkShareKey
    ) {
      return;
    }
    // Joined only once the review opens, so that a link to a deleted share,
    // or cut short, neither leaves a bookmark nor replaces a working key.
    let isCurrent = true;
    void loadLinkedReview(window.location.origin, shareId, linkShareKey)
      .catch(() => null)
      .then(async (linkedReview) => {
        if (!isCurrent) {
          return;
        }
        if (linkedReview) {
          await joinShare(
            shareId,
            linkShareKey,
            linkedReview.reviewFile.data.target.title,
            shareBookmark,
          );
        } else {
          setUnusableShareKey(linkShareKey);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [shareId, linkShareKey, shareBookmark]);
  return linkShareKey !== null && linkShareKey === unusableShareKey;
}
