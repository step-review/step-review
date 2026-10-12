import { Anchor } from "@mantine/core";
import type { ReactNode } from "react";
import useOpenExampleReview from "../../../business-logic/review/useOpenExampleReview.ts";

interface Props {
  children: ReactNode;
}

/** A link that opens the example review, styled like the surrounding text. */
export default function ExampleReviewLink({ children }: Props) {
  const openExampleReview = useOpenExampleReview();
  return (
    <Anchor
      component="button"
      type="button"
      inherit
      onClick={() => {
        void openExampleReview();
      }}
    >
      {children}
    </Anchor>
  );
}
