import { Button, ButtonGroup, Checkbox, FormControl } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import type DiffPreferences from "../../../business-logic/preferences/DiffPreferences.ts";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import MarkAllViewedButton from "../MarkAllViewedButton/MarkAllViewedButton.tsx";
import styles from "./StepToolbar.module.css";

interface Props {
  preferences: DiffPreferences;
  stepView: StepView;
}

export default function StepToolbar({ preferences, stepView }: Props) {
  const intl = useIntl();
  return (
    <div className={styles["toolbar"]}>
      <ButtonGroup
        role="group"
        aria-label={intl.formatMessage({ defaultMessage: "Diff layout" })}
      >
        <Button
          size="small"
          className={styles["layoutButton"]}
          aria-pressed={preferences.layout === "unified"}
          onClick={() => preferences.setLayout("unified")}
        >
          <FormattedMessage defaultMessage="Unified" />
        </Button>
        <Button
          size="small"
          className={styles["layoutButton"]}
          aria-pressed={preferences.layout === "split"}
          onClick={() => preferences.setLayout("split")}
        >
          <FormattedMessage defaultMessage="Split" />
        </Button>
      </ButtonGroup>
      <FormControl>
        <Checkbox
          checked={preferences.explainers === "hidden"}
          onChange={(event) =>
            preferences.setExplainers(
              event.currentTarget.checked ? "hidden" : "shown",
            )
          }
        />
        <FormControl.Label>
          <FormattedMessage defaultMessage="Only issues" />
        </FormControl.Label>
      </FormControl>
      <div className={styles["markAllViewed"]}>
        <MarkAllViewedButton stepView={stepView} />
      </div>
    </div>
  );
}
