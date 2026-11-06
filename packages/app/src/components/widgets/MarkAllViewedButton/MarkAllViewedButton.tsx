import { ChecklistIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import { FormattedMessage } from "react-intl";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type StepView from "../../../business-logic/review-view/StepView.ts";

interface Props {
  stepView: StepView;
}

export default function MarkAllViewedButton({ stepView }: Props) {
  const { dispatch } = useReviewState();
  return (
    <Button
      size="small"
      leadingVisual={ChecklistIcon}
      onClick={() =>
        dispatch({
          type: "setViewed",
          fingerprints: stepView.files.map((file) => file.fingerprint),
          viewed: true,
        })
      }
    >
      <FormattedMessage defaultMessage="Mark all as viewed" />
    </Button>
  );
}
