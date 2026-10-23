import { Button, Group, SegmentedControl, Switch } from "@mantine/core";
import { IconChecks } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import type DiffPreferences from "../../../business-logic/preferences/DiffPreferences.ts";

interface Props {
  preferences: DiffPreferences;
  onMarkAllViewed: () => void;
}

export default function StepToolbar({ preferences, onMarkAllViewed }: Props) {
  const intl = useIntl();
  return (
    <Group gap="md" wrap="wrap">
      <SegmentedControl
        size="xs"
        value={preferences.layout}
        onChange={(value) => preferences.setLayout(value)}
        data={[
          {
            value: "unified",
            label: intl.formatMessage({ defaultMessage: "Unified" }),
          },
          {
            value: "split",
            label: intl.formatMessage({ defaultMessage: "Split" }),
          },
        ]}
      />
      <Switch
        size="xs"
        label={<FormattedMessage defaultMessage="Only issues" />}
        checked={preferences.explainers === "hidden"}
        onChange={(event) =>
          preferences.setExplainers(
            event.currentTarget.checked ? "hidden" : "shown",
          )
        }
      />
      <Button
        size="xs"
        variant="light"
        ml="auto"
        leftSection={<IconChecks size={14} />}
        onClick={onMarkAllViewed}
      >
        <FormattedMessage defaultMessage="Mark all as viewed" />
      </Button>
    </Group>
  );
}
