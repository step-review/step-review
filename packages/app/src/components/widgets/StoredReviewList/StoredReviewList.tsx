import { TrashIcon } from "@primer/octicons-react";
import { IconButton, Link, useConfirm } from "@primer/react";
import { useIntl } from "react-intl";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import deleteReview from "../../../business-logic/review-store/deleteReview.ts";
import type StoredReview from "../../../business-logic/review-store/StoredReview.ts";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import styles from "./StoredReviewList.module.css";

interface Props {
  storedReviews: StoredReview[];
}

/** The reviews kept in the browser, to open again or delete. */
export default function StoredReviewList({ storedReviews }: Props) {
  return (
    <ul className={styles["list"]}>
      {storedReviews.map((storedReview) => (
        <StoredReviewItem
          key={storedReview.reviewId}
          storedReview={storedReview}
        />
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
  const route: NavigableRoute = {
    name: RouteName.Overview,
    reviewId: storedReview.reviewId,
  };
  const deleteStoredReview = async () => {
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
    <li className={styles["item"]}>
      <div className={styles["details"]}>
        <Link
          href={routeHref(route)}
          onClick={(event) => {
            event.preventDefault();
            navigateTo(route);
          }}
          className={styles["title"]}
        >
          <TruncatedText tooltip={storedReview.title}>
            {storedReview.title}
          </TruncatedText>
        </Link>
        <span className={styles["fileName"]}>
          <TruncatedText tooltip={storedReview.fileName}>
            {storedReview.fileName}
          </TruncatedText>
        </span>
      </div>
      <IconButton
        variant="invisible"
        size="small"
        className={styles["deleteButton"]}
        icon={TrashIcon}
        aria-label={intl.formatMessage({ defaultMessage: "Delete review" })}
        onClick={() => void deleteStoredReview()}
      />
    </li>
  );
}
