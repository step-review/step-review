import { Select } from "@mantine/core";
import type { ReviewFile } from "@step-review/review-format";
import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";

interface Props {
  reviewFile: ReviewFile;
  roundNumber: number;
}

export default function RoundSwitcher({ reviewFile, roundNumber }: Props) {
  const intl = useIntl();
  return (
    <Select
      size="xs"
      w={{ base: 140, sm: 230 }}
      allowDeselect={false}
      aria-label={intl.formatMessage({ defaultMessage: "Review round" })}
      value={String(roundNumber)}
      onChange={(value) =>
        navigateTo({ name: RouteName.Overview, roundNumber: Number(value) })
      }
      data={reviewFile.rounds.map((round) => ({
        value: String(round.number),
        label: intl.formatMessage(
          { defaultMessage: "Round {roundNumber} · {date} · {commit}" },
          {
            roundNumber: round.number,
            date: intl.formatDate(round.data.createdAt, {
              dateStyle: "medium",
            }),
            commit: round.data.target.headCommit.slice(0, 7),
          },
        ),
      }))}
    />
  );
}
