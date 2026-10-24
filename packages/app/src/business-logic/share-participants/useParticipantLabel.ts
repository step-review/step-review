import { useCallback } from "react";
import { useIntl } from "react-intl";
import type ShareParticipantView from "./ShareParticipantView.ts";

/** How participants are named to the others, and to themselves. */
export default function useParticipantLabel(): (
  shareParticipant: ShareParticipantView,
) => string {
  const intl = useIntl();
  return useCallback(
    ({ name, isSelf }) => {
      const displayedName =
        name || intl.formatMessage({ defaultMessage: "Anonymous" });
      return isSelf
        ? intl.formatMessage(
            { defaultMessage: "{name} (you)" },
            { name: displayedName },
          )
        : displayedName;
    },
    [intl],
  );
}
