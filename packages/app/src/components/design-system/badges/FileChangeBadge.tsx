import { Badge, Tooltip } from "@mantine/core";
import { FormattedMessage } from "react-intl";

interface Props {
  change: "new" | "changed" | null;
  previousRoundNumber: number;
}

/** Shows that a file is new or changed since the previous round. */
export default function FileChangeBadge({
  change,
  previousRoundNumber,
}: Props) {
  if (!change) {
    return null;
  }
  return (
    <Tooltip
      withArrow
      label={
        change === "new" ? (
          <FormattedMessage
            defaultMessage="Not in the PR at round {roundNumber}"
            values={{ roundNumber: previousRoundNumber }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="Changed since round {roundNumber}"
            values={{ roundNumber: previousRoundNumber }}
          />
        )
      }
    >
      <Badge miw="max-content" color="revision" size="sm">
        {change === "new" ? (
          <FormattedMessage defaultMessage="New" />
        ) : (
          <FormattedMessage defaultMessage="Changed" />
        )}
      </Badge>
    </Tooltip>
  );
}
