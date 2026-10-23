import { useIntl } from "react-intl";
import useOpenExampleReview from "../../../business-logic/review/useOpenExampleReview.ts";
import ScreenshotFrame from "../../design-system/ScreenshotFrame/ScreenshotFrame.tsx";
import styles from "./ExampleReviewPreview.module.css";

/** A screenshot of the example review, opening it when clicked. */
export default function ExampleReviewPreview() {
  const intl = useIntl();
  const openExampleReview = useOpenExampleReview();
  return (
    <button
      type="button"
      className={styles["button"]}
      onClick={() => {
        void openExampleReview();
      }}
    >
      <ScreenshotFrame
        lightSrc="/screenshots/review-light.jpg"
        darkSrc="/screenshots/review-dark.jpg"
        alt={intl.formatMessage({
          defaultMessage:
            "Screenshot of a review step: the diff, with notes from the coding agent.",
        })}
      />
    </button>
  );
}
