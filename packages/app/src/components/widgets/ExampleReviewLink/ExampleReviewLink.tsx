import { Link } from "@primer/react";
import type { ReactNode } from "react";
import useOpenExampleReview from "../../../business-logic/review/useOpenExampleReview.ts";
import styles from "./ExampleReviewLink.module.css";

interface Props {
  children: ReactNode;
}

/** A link that opens the example review, styled like the surrounding text. */
export default function ExampleReviewLink({ children }: Props) {
  const openExampleReview = useOpenExampleReview();
  return (
    <Link
      as="button"
      type="button"
      inline
      className={styles["link"]}
      onClick={() => {
        void openExampleReview();
      }}
    >
      {children}
    </Link>
  );
}
