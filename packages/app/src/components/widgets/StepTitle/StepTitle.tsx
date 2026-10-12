import { FormattedMessage } from "react-intl";
import type StepView from "../../../business-logic/rounds/StepView.ts";

interface Props {
  step: StepView;
}

export default function StepTitle({ step }: Props) {
  return step.title ?? <FormattedMessage defaultMessage="Files in no step" />;
}
