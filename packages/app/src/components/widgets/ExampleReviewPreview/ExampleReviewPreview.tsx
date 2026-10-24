import { useIntl } from "react-intl";
import openExampleReview from "../../../business-logic/review/openExampleReview.ts";
import ScreenshotFrame from "../../design-system/ScreenshotFrame/ScreenshotFrame.tsx";
import styles from "./ExampleReviewPreview.module.css";

/** A screenshot of the example review, opening it when clicked. */
export default function ExampleReviewPreview() {
  const intl = useIntl();
  return (
    <button
      type="button"
      className={styles["button"]}
      onClick={openExampleReview}
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
