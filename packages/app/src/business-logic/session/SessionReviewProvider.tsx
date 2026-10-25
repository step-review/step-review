import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import navigateTo from "../navigation/navigateTo.ts";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import RouteName from "../navigation/RouteName.ts";
import useLocationParts from "../navigation/useLocationParts.ts";
import LoadedReviewValue from "../review/LoadedReviewValue.tsx";
import SessionConnectionProvider from "../session-connection/SessionConnectionProvider.tsx";
import useSessionConnection from "../session-connection/useSessionConnection.ts";
import useImportedSessionKey from "../session-crypto/useImportedSessionKey.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import updateSessionBookmark from "../session-store/updateSessionBookmark.ts";
import useSessionBookmark from "../session-store/useSessionBookmark.ts";
import useJoinLinkedSession from "./useJoinLinkedSession.ts";
import useSessionLoadedReview from "./useSessionLoadedReview.ts";

type SessionReviewAddress = Extract<ReviewAddress, { kind: "session" }>;

interface Props {
  reviewAddress: SessionReviewAddress;
  children: ReactNode;
}

/**
 * Provides a session's review and the connection to the session. The link's key
 * is kept in the session's bookmark, joining the session the first time; the
 * URLs of the review's pages keep holding it, so that any of them can be passed
 * on.
 */
export default function SessionReviewProvider({
  reviewAddress,
  children,
}: Props) {
  const { sessionId, sessionKey: linkSessionKey } = reviewAddress;
  const sessionBookmark = useSessionBookmark(sessionId);
  const isLinkUnusable = useJoinLinkedSession(
    sessionId,
    linkSessionKey,
    sessionBookmark,
  );
  const { route, fragment } = useLocationParts();
  const bookmarkedSessionKey = sessionBookmark?.sessionKey ?? null;
  useEffect(() => {
    // E.g. a URL copied without its fragment, or cut short: put the working key
    // back, so that the URL can be passed on.
    if (
      (linkSessionKey === null || isLinkUnusable) &&
      bookmarkedSessionKey !== null &&
      (route.name === RouteName.Overview || route.name === RouteName.Step)
    ) {
      navigateTo(
        {
          ...route,
          reviewAddress: {
            kind: "session",
            sessionId,
            sessionKey: bookmarkedSessionKey,
          },
        },
        fragment,
        { replace: true },
      );
    }
  }, [
    sessionId,
    linkSessionKey,
    isLinkUnusable,
    bookmarkedSessionKey,
    route,
    fragment,
  ]);
  const resolvedReviewAddress = useMemo<SessionReviewAddress>(
    () => ({ kind: "session", sessionId, sessionKey: bookmarkedSessionKey }),
    [sessionId, bookmarkedSessionKey],
  );
  if (sessionBookmark === null && (linkSessionKey === null || isLinkUnusable)) {
    return (
      <LoadedReviewValue
        loadedReview={null}
        reviewAddress={resolvedReviewAddress}
      >
        {children}
      </LoadedReviewValue>
    );
  }
  // Until joining stores the link's key in the bookmark. A link that can't
  // open the session leaves the bookmarked key.
  if (
    !sessionBookmark ||
    (linkSessionKey !== null &&
      sessionBookmark.sessionKey !== linkSessionKey &&
      !isLinkUnusable)
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
    <SessionKeyProvider
      key={sessionBookmark.sessionKey}
      reviewAddress={resolvedReviewAddress}
      sessionBookmark={sessionBookmark}
    >
      {children}
    </SessionKeyProvider>
  );
}

interface SessionKeyProviderProps {
  reviewAddress: SessionReviewAddress;
  sessionBookmark: SessionBookmark;
  children: ReactNode;
}

function SessionKeyProvider({
  reviewAddress,
  sessionBookmark,
  children,
}: SessionKeyProviderProps) {
  const sessionKey = useImportedSessionKey(sessionBookmark.sessionKey);
  if (!sessionKey) {
    return (
      <LoadedReviewValue
        loadedReview={sessionKey}
        reviewAddress={reviewAddress}
      >
        {children}
      </LoadedReviewValue>
    );
  }
  return (
    <SessionConnector
      reviewAddress={reviewAddress}
      sessionBookmark={sessionBookmark}
      sessionKey={sessionKey}
    >
      {children}
    </SessionConnector>
  );
}

interface SessionConnectorProps extends SessionKeyProviderProps {
  sessionKey: CryptoKey;
}

function SessionConnector({
  reviewAddress,
  sessionBookmark,
  sessionKey,
  children,
}: SessionConnectorProps) {
  const apiOrigin = window.location.origin;
  const { sessionId, participantId, participantSecret } = sessionBookmark;
  const sessionConnection = useSessionConnection({
    apiOrigin,
    sessionId,
    sessionKey,
    participantId,
    participantSecret,
  });
  if (!sessionConnection) {
    return (
      <LoadedReviewValue loadedReview={undefined} reviewAddress={reviewAddress}>
        {children}
      </LoadedReviewValue>
    );
  }
  return (
    <SessionConnectionValue
      reviewAddress={reviewAddress}
      sessionBookmark={sessionBookmark}
      sessionKey={sessionKey}
      sessionConnection={sessionConnection}
    >
      {children}
    </SessionConnectionValue>
  );
}

interface SessionConnectionValueProps extends SessionConnectorProps {
  sessionConnection: NonNullable<ReturnType<typeof useSessionConnection>>;
}

function SessionConnectionValue({
  reviewAddress,
  sessionBookmark,
  sessionKey,
  sessionConnection,
  children,
}: SessionConnectionValueProps) {
  const sessionConnectionSnapshot = useSyncExternalStore(
    sessionConnection.subscribe,
    sessionConnection.getSnapshot,
  );
  const loadedReview = useSessionLoadedReview(
    window.location.origin,
    sessionBookmark.sessionId,
    sessionKey,
  );
  const title = loadedReview?.reviewFile.data.target.title;
  useEffect(() => {
    if (title !== undefined) {
      void updateSessionBookmark(sessionBookmark.sessionId, {
        title,
        openedAt: Date.now(),
      });
    }
  }, [sessionBookmark.sessionId, title]);
  const value = useMemo(
    () => ({ sessionBookmark, sessionConnection, sessionConnectionSnapshot }),
    [sessionBookmark, sessionConnection, sessionConnectionSnapshot],
  );
  return (
    <SessionConnectionProvider value={value}>
      <LoadedReviewValue
        loadedReview={loadedReview}
        reviewAddress={reviewAddress}
      >
        {children}
      </LoadedReviewValue>
    </SessionConnectionProvider>
  );
}
