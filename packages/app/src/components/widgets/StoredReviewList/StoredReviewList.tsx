import { TrashIcon } from "@primer/octicons-react";
import { IconButton, Link, useConfirm } from "@primer/react";
import { useIntl } from "react-intl";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import deleteReview from "../../../business-logic/review-store/deleteReview.ts";
import type StoredReview from "../../../business-logic/review-store/StoredReview.ts";
import deleteSessionBookmark from "../../../business-logic/session-store/deleteSessionBookmark.ts";
import type SessionBookmark from "../../../business-logic/session-store/SessionBookmark.ts";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import styles from "./StoredReviewList.module.css";

interface Props {
  storedReviews: StoredReview[];
  sessionBookmarks: SessionBookmark[];
}

/**
 * The reviews kept in the browser and the sessions opened in it, most recently
 * opened first, to open again or remove.
 */
export default function StoredReviewList({
  storedReviews,
  sessionBookmarks,
}: Props) {
  const items = [
    ...storedReviews.map((storedReview) => ({
      key: `local:${storedReview.reviewId}`,
      openedAt: storedReview.openedAt,
      element: <StoredReviewItem storedReview={storedReview} />,
    })),
    ...sessionBookmarks.map((sessionBookmark) => ({
      key: `session:${sessionBookmark.sessionId}`,
      openedAt: sessionBookmark.openedAt,
      element: <SessionReviewItem sessionBookmark={sessionBookmark} />,
    })),
  ].sort((first, second) => second.openedAt - first.openedAt);
  return (
    <ul className={styles["list"]}>
      {items.map((item) => (
        <li key={item.key} className={styles["item"]}>
          {item.element}
        </li>
      ))}
    </ul>
  );
}

interface StoredReviewItemProps {
  storedReview: StoredReview;
}

function StoredReviewItem({ storedReview }: StoredReviewItemProps) {
  const intl = useIntl();
  const confirm = useConfirm();
  const removeStoredReview = async () => {
    const isConfirmed = await confirm({
      title: intl.formatMessage({ defaultMessage: "Delete review?" }),
      content: intl.formatMessage({
        defaultMessage:
          "The review file and its review state will be removed from this browser.",
      }),
      confirmButtonContent: intl.formatMessage({ defaultMessage: "Delete" }),
      confirmButtonType: "danger",
    });
    if (isConfirmed) {
      await deleteReview(storedReview.reviewId);
    }
  };
  return (
    <ReviewItem
      route={{
        name: RouteName.Overview,
        reviewAddress: { kind: "local", reviewId: storedReview.reviewId },
      }}
      title={storedReview.title}
      detail={storedReview.fileName}
      isDetailFileName
      removeLabel={intl.formatMessage({ defaultMessage: "Delete review" })}
      onRemove={() => void removeStoredReview()}
    />
  );
}

interface SessionReviewItemProps {
  sessionBookmark: SessionBookmark;
}

function SessionReviewItem({ sessionBookmark }: SessionReviewItemProps) {
  const intl = useIntl();
  const confirm = useConfirm();
  const removeSessionBookmark = async () => {
    const isConfirmed = await confirm({
      title: intl.formatMessage({
        defaultMessage: "Remove the session?",
      }),
      content:
        sessionBookmark.ownerSecret === null
          ? intl.formatMessage({
              defaultMessage:
                "It will be removed from this browser. You can join it again with its link, as a new participant.",
            })
          : intl.formatMessage({
              defaultMessage:
                "It will be removed from this browser, but stay available to the others until it expires: you won't be able to update the review or end the session. To delete it for everyone, end the session from the review instead.",
            }),
      confirmButtonContent: intl.formatMessage({ defaultMessage: "Remove" }),
      confirmButtonType: "danger",
    });
    if (isConfirmed) {
      await deleteSessionBookmark(sessionBookmark.sessionId);
    }
  };
  const { sessionId, sessionKey } = sessionBookmark;
  return (
    <ReviewItem
      route={{
        name: RouteName.Overview,
        reviewAddress: { kind: "session", sessionId, sessionKey },
      }}
      title={
        sessionBookmark.title ||
        intl.formatMessage({ defaultMessage: "Session" })
      }
      detail={
        sessionBookmark.ownerSecret === null
          ? intl.formatMessage({ defaultMessage: "Joined session" })
          : intl.formatMessage({ defaultMessage: "Started by you" })
      }
      removeLabel={intl.formatMessage({
        defaultMessage: "Remove the session",
      })}
      onRemove={() => void removeSessionBookmark()}
    />
  );
}

interface ReviewItemProps {
  route: NavigableRoute;
  title: string;
  /** The file name, or whose session it is. */
  detail: string;
  isDetailFileName?: boolean;
  removeLabel: string;
  onRemove: () => void;
}

function ReviewItem({
  route,
  title,
  detail,
  isDetailFileName = false,
  removeLabel,
  onRemove,
}: ReviewItemProps) {
  return (
    <>
      <div className={styles["details"]}>
        <Link
          href={routeHref(route)}
          onClick={(event) => {
            event.preventDefault();
            navigateTo(route);
          }}
          className={styles["title"]}
        >
          <TruncatedText tooltip={title}>{title}</TruncatedText>
        </Link>
        <span
          className={styles["detail"]}
          data-file-name={isDetailFileName || undefined}
        >
          <TruncatedText tooltip={detail}>{detail}</TruncatedText>
        </span>
      </div>
      <IconButton
        variant="invisible"
        size="small"
        className={styles["deleteButton"]}
        icon={TrashIcon}
        aria-label={removeLabel}
        onClick={onRemove}
      />
    </>
  );
}
