import { Link } from "@primer/react";
import type { ReactNode } from "react";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import exampleReviewId from "../../../business-logic/review/exampleReviewId.ts";
import RouteLink from "../RouteLink/RouteLink.tsx";

interface Props {
  children: ReactNode;
}

/** A link that opens the example review. */
export default function ExampleReviewLink({ children }: Props) {
  return (
    <Link
      as={RouteLink}
      inline
      route={{
        name: RouteName.Overview,
        reviewAddress: { kind: "local", reviewId: exampleReviewId },
      }}
    >
      {children}
    </Link>
  );
}
