import { ChecklistIcon } from "@primer/octicons-react";
import { Button, Checkbox, FormControl, SegmentedControl } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import type DiffPreferences from "../../../business-logic/preferences/DiffPreferences.ts";
import styles from "./StepToolbar.module.css";

interface Props {
  preferences: DiffPreferences;
  onMarkAllViewed: () => void;
}

const layouts = ["unified", "split"] as const;

export default function StepToolbar({ preferences, onMarkAllViewed }: Props) {
  const intl = useIntl();
  return (
    <div className={styles["toolbar"]}>
      <SegmentedControl
        size="small"
        aria-label={intl.formatMessage({ defaultMessage: "Diff layout" })}
        onChange={(selectedIndex) => {
          const layout = layouts[selectedIndex ?? 0];
          if (layout) {
            preferences.setLayout(layout);
          }
        }}
      >
        <SegmentedControl.Button selected={preferences.layout === "unified"}>
          {intl.formatMessage({ defaultMessage: "Unified" })}
        </SegmentedControl.Button>
        <SegmentedControl.Button selected={preferences.layout === "split"}>
          {intl.formatMessage({ defaultMessage: "Split" })}
        </SegmentedControl.Button>
      </SegmentedControl>
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
      <Button
        size="small"
        leadingVisual={ChecklistIcon}
        className={styles["markAllViewed"]}
        onClick={onMarkAllViewed}
      >
        <FormattedMessage defaultMessage="Mark all as viewed" />
      </Button>
    </div>
  );
}
