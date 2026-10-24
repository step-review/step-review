import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import navigateTo from "../navigation/navigateTo.ts";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import RouteName from "../navigation/RouteName.ts";
import useLocationParts from "../navigation/useLocationParts.ts";
import LoadedReviewValue from "../review/LoadedReviewValue.tsx";
import useImportedShareKey from "../share-crypto/useImportedShareKey.ts";
import ShareSessionProvider from "../share-session/ShareSessionProvider.tsx";
import useShareSession from "../share-session/useShareSession.ts";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import updateShareBookmark from "../share-store/updateShareBookmark.ts";
import useShareBookmark from "../share-store/useShareBookmark.ts";
import useJoinLinkedShare from "./useJoinLinkedShare.ts";
import useSharedLoadedReview from "./useSharedLoadedReview.ts";

type SharedReviewAddress = Extract<ReviewAddress, { kind: "shared" }>;

interface Props {
  reviewAddress: SharedReviewAddress;
  children: ReactNode;
}

/**
 * Provides a shared review and its session. The link's key is kept in the
 * share's bookmark, joining the share the first time; the URLs of the review's
 * pages keep holding it, so that any of them can be passed on.
 */
export default function SharedReviewProvider({
  reviewAddress,
  children,
}: Props) {
  const { shareId, shareKey: linkShareKey } = reviewAddress;
  const shareBookmark = useShareBookmark(shareId);
  const isLinkUnusable = useJoinLinkedShare(
    shareId,
    linkShareKey,
    shareBookmark,
  );
  const { route, fragment } = useLocationParts();
  const bookmarkedShareKey = shareBookmark?.shareKey ?? null;
  useEffect(() => {
    // E.g. a URL copied without its fragment: put the key back, so that the
    // URL can be passed on.
    if (
      linkShareKey === null &&
      bookmarkedShareKey !== null &&
      (route.name === RouteName.Overview || route.name === RouteName.Step)
    ) {
      navigateTo(
        {
          ...route,
          reviewAddress: {
            kind: "shared",
            shareId,
            shareKey: bookmarkedShareKey,
          },
        },
        fragment,
        { replace: true },
      );
    }
  }, [shareId, linkShareKey, bookmarkedShareKey, route, fragment]);
  const resolvedReviewAddress = useMemo<SharedReviewAddress>(
    () => ({ kind: "shared", shareId, shareKey: bookmarkedShareKey }),
    [shareId, bookmarkedShareKey],
  );
  if ((shareBookmark === null && linkShareKey === null) || isLinkUnusable) {
    return (
      <LoadedReviewValue
        loadedReview={null}
        reviewAddress={resolvedReviewAddress}
      >
        {children}
      </LoadedReviewValue>
    );
  }
  // Until joining stores the link's key in the bookmark.
  if (
    !shareBookmark ||
    (linkShareKey !== null && shareBookmark.shareKey !== linkShareKey)
  ) {
    return (
      <LoadedReviewValue
        loadedReview={undefined}
        reviewAddress={resolvedReviewAddress}
      >
        {children}
      </LoadedReviewValue>
    );
  }
  return (
    <ShareKeyProvider
      key={shareBookmark.shareKey}
      reviewAddress={resolvedReviewAddress}
      shareBookmark={shareBookmark}
    >
      {children}
    </ShareKeyProvider>
  );
}

interface ShareKeyProviderProps {
  reviewAddress: SharedReviewAddress;
  shareBookmark: ShareBookmark;
  children: ReactNode;
}

function ShareKeyProvider({
  reviewAddress,
  shareBookmark,
  children,
}: ShareKeyProviderProps) {
  const shareKey = useImportedShareKey(shareBookmark.shareKey);
  if (!shareKey) {
    return (
      <LoadedReviewValue loadedReview={shareKey} reviewAddress={reviewAddress}>
        {children}
      </LoadedReviewValue>
    );
  }
  return (
    <ShareSessionConnector
      reviewAddress={reviewAddress}
      shareBookmark={shareBookmark}
      shareKey={shareKey}
    >
      {children}
    </ShareSessionConnector>
  );
}

interface ShareSessionConnectorProps extends ShareKeyProviderProps {
  shareKey: CryptoKey;
}

function ShareSessionConnector({
  reviewAddress,
  shareBookmark,
  shareKey,
  children,
}: ShareSessionConnectorProps) {
  const apiOrigin = window.location.origin;
  const { shareId, participantId, participantSecret } = shareBookmark;
  const shareSession = useShareSession({
    apiOrigin,
    shareId,
    shareKey,
    participantId,
    participantSecret,
  });
  if (!shareSession) {
    return (
      <LoadedReviewValue loadedReview={undefined} reviewAddress={reviewAddress}>
        {children}
      </LoadedReviewValue>
    );
  }
  return (
    <ShareSessionValue
      reviewAddress={reviewAddress}
      shareBookmark={shareBookmark}
      shareKey={shareKey}
      shareSession={shareSession}
    >
      {children}
    </ShareSessionValue>
  );
}

interface ShareSessionValueProps extends ShareSessionConnectorProps {
  shareSession: NonNullable<ReturnType<typeof useShareSession>>;
}

function ShareSessionValue({
  reviewAddress,
  shareBookmark,
  shareKey,
  shareSession,
  children,
}: ShareSessionValueProps) {
  const shareSessionSnapshot = useSyncExternalStore(
    shareSession.subscribe,
    shareSession.getSnapshot,
  );
  const loadedReview = useSharedLoadedReview(
    window.location.origin,
    shareBookmark.shareId,
    shareKey,
    shareSessionSnapshot.versionId,
  );
  const { route } = useLocationParts();
  const presenceStepId = route.name === RouteName.Step ? route.stepId : null;
  useEffect(() => {
    shareSession.setPresence(presenceStepId);
  }, [shareSession, presenceStepId]);
  const title = loadedReview?.reviewFile.data.target.title;
  useEffect(() => {
    if (title !== undefined) {
      void updateShareBookmark(shareBookmark.shareId, {
        title,
        openedAt: Date.now(),
      });
    }
  }, [shareBookmark.shareId, title]);
  const value = useMemo(
    () => ({ shareBookmark, shareKey, shareSession, shareSessionSnapshot }),
    [shareBookmark, shareKey, shareSession, shareSessionSnapshot],
  );
  return (
    <ShareSessionProvider value={value}>
      <LoadedReviewValue
        loadedReview={loadedReview}
        reviewAddress={reviewAddress}
      >
        {children}
      </LoadedReviewValue>
    </ShareSessionProvider>
  );
}
