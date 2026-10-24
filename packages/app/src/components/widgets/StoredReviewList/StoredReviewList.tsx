import { TrashIcon } from "@primer/octicons-react";
import { IconButton, Link, useConfirm } from "@primer/react";
import { useIntl } from "react-intl";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import deleteReview from "../../../business-logic/review-store/deleteReview.ts";
import type StoredReview from "../../../business-logic/review-store/StoredReview.ts";
import deleteShareBookmark from "../../../business-logic/share-store/deleteShareBookmark.ts";
import type ShareBookmark from "../../../business-logic/share-store/ShareBookmark.ts";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import styles from "./StoredReviewList.module.css";

interface Props {
  storedReviews: StoredReview[];
  shareBookmarks: ShareBookmark[];
}

/**
 * The reviews kept in the browser and the shared reviews opened in it, most
 * recently opened first, to open again or remove.
 */
export default function StoredReviewList({
  storedReviews,
  shareBookmarks,
}: Props) {
  const items = [
    ...storedReviews.map((storedReview) => ({
      key: `local:${storedReview.reviewId}`,
      openedAt: storedReview.openedAt,
      element: <StoredReviewItem storedReview={storedReview} />,
    })),
    ...shareBookmarks.map((shareBookmark) => ({
      key: `shared:${shareBookmark.shareId}`,
      openedAt: shareBookmark.openedAt,
      element: <SharedReviewItem shareBookmark={shareBookmark} />,
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

interface SharedReviewItemProps {
  shareBookmark: ShareBookmark;
}

function SharedReviewItem({ shareBookmark }: SharedReviewItemProps) {
  const intl = useIntl();
  const confirm = useConfirm();
  const removeShareBookmark = async () => {
    const isConfirmed = await confirm({
      title: intl.formatMessage({
        defaultMessage: "Remove the shared review?",
      }),
      content:
        shareBookmark.ownerSecret === null
          ? intl.formatMessage({
              defaultMessage:
                "It will be removed from this browser. You can join it again with its link, as a new participant.",
            })
          : intl.formatMessage({
              defaultMessage:
                "It will be removed from this browser, but stay shared until it expires: you won't be able to update it or stop sharing it. To delete it for everyone, stop sharing it from the review instead.",
            }),
      confirmButtonContent: intl.formatMessage({ defaultMessage: "Remove" }),
      confirmButtonType: "danger",
    });
    if (isConfirmed) {
      await deleteShareBookmark(shareBookmark.shareId);
    }
  };
  const { shareId, shareKey } = shareBookmark;
  return (
    <ReviewItem
      route={{
        name: RouteName.Overview,
        reviewAddress: { kind: "shared", shareId, shareKey },
      }}
      title={
        shareBookmark.title ||
        intl.formatMessage({ defaultMessage: "Shared review" })
      }
      detail={
        shareBookmark.ownerSecret === null
          ? intl.formatMessage({ defaultMessage: "Shared with you" })
          : intl.formatMessage({ defaultMessage: "Shared by you" })
      }
      removeLabel={intl.formatMessage({
        defaultMessage: "Remove the shared review",
      })}
      onRemove={() => void removeShareBookmark()}
    />
  );
}

interface ReviewItemProps {
  route: NavigableRoute;
  title: string;
  /** The file name, or how the review is shared. */
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
