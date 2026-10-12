import { Button, Kbd } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import {
  IconFile,
  IconListNumbers,
  IconMessage,
  IconSearch,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type RoundView from "../../../business-logic/rounds/RoundView.ts";
import createSearchEntries from "../../../business-logic/search/createSearchEntries.ts";

interface Props {
  roundView: RoundView;
}

const icons = { step: IconListNumbers, file: IconFile, note: IconMessage };

/** Quick jump to steps, files and notes of the round. */
export default function ReviewSearch({ roundView }: Props) {
  const intl = useIntl();
  const roundNumber = roundView.round.number;
  const actions = useMemo(
    () =>
      createSearchEntries(
        roundView,
        intl.formatMessage({ defaultMessage: "Files in no step" }),
      ).map((entry) => {
        const Icon = icons[entry.kind];
        return {
          id: entry.id,
          label: entry.label,
          description: entry.description.slice(0, 140),
          leftSection: <Icon size={18} stroke={1.5} />,
          onClick: () =>
            navigateTo(
              { name: RouteName.Step, roundNumber, stepId: entry.stepId },
              entry.fragment ?? undefined,
            ),
        };
      }),
    [roundView, roundNumber, intl],
  );
  return (
    <>
      <Button
        variant="default"
        size="xs"
        leftSection={<IconSearch size={14} />}
        rightSection={<Kbd size="xs">⌘K</Kbd>}
        onClick={() => spotlight.open()}
        visibleFrom="sm"
      >
        <FormattedMessage defaultMessage="Jump to" />
      </Button>
      <Spotlight
        actions={actions}
        limit={50}
        shortcut={["mod + K", "/"]}
        nothingFound={<FormattedMessage defaultMessage="Nothing found" />}
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={18} stroke={1.5} />,
          placeholder: intl.formatMessage({
            defaultMessage: "Search steps, files and notes",
          }),
        }}
      />
    </>
  );
}
