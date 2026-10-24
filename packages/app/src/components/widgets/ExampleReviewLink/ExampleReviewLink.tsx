import { Link } from "@primer/react";
import type { ReactNode } from "react";
import openExampleReview from "../../../business-logic/review/openExampleReview.ts";
import styles from "./ExampleReviewLink.module.css";

interface Props {
  children: ReactNode;
}

/** A link that opens the example review, styled like the surrounding text. */
export default function ExampleReviewLink({ children }: Props) {
  return (
    <Link
      as="button"
      type="button"
      inline
      className={styles["link"]}
      onClick={openExampleReview}
    >
      {children}
    </Link>
  );
}
