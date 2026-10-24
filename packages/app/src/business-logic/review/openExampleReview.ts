import navigateTo from "../navigation/navigateTo.ts";
import RouteName from "../navigation/RouteName.ts";
import exampleReviewId from "./exampleReviewId.ts";

export default function openExampleReview() {
  navigateTo({
    name: RouteName.Overview,
    reviewAddress: { kind: "local", reviewId: exampleReviewId },
  });
}
