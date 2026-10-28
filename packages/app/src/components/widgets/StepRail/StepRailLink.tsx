import { Tooltip } from "@primer/react";
import type { Attention } from "@step-review/review-format";
import { useIntl } from "react-intl";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import AttentionIcon from "../../design-system/badges/AttentionIcon.tsx";
import InitialsAvatar from "../../design-system/InitialsAvatar/InitialsAvatar.tsx";
import StepMarker from "../../design-system/StepMarker/StepMarker.tsx";
import useParticipantsHere from "../ParticipantsHere/useParticipantsHere.ts";
import RouteLink from "../RouteLink/RouteLink.tsx";
import styles from "./StepRailLink.module.css";

interface Props {
  route: NavigableRoute;
  /** `null` for the overview. */
  stepId: string | null;
  number: number;
  title: string;
  /** E.g. the step's counts, after the title in the tooltip. */
  details: string[];
  attention: Attention;
  /** `undefined` for the overview, which has no files. */
  progress: { viewedCount: number; totalCount: number } | undefined;
  isActive: boolean;
  onNavigate: () => void;
}

/**
 * A step's marker in the rail, with its attention and who is on it as badges,
 * and all of that, with its title, in its tooltip.
 */
export default function StepRailLink({
  route,
  stepId,
  number,
  title,
  details,
  attention,
  progress,
  isActive,
  onNavigate,
}: Props) {
  const intl = useIntl();
  const participantsHere = useParticipantsHere({ stepId });
  const [firstPersonHere] = participantsHere.people;
  const allDetails = [
    ...details,
    ...(attention === "high"
      ? [intl.formatMessage({ defaultMessage: "Read carefully" })]
      : []),
    ...(attention === "low"
      ? [intl.formatMessage({ defaultMessage: "Skim" })]
      : []),
    ...(firstPersonHere ? [participantsHere.label] : []),
  ];
  const label =
    allDetails.length === 0
      ? title
      : intl.formatMessage(
          { defaultMessage: "{title}: {details}" },
          {
            title,
            details: intl.formatList(allDetails, { type: "unit" }),
          },
        );
  return (
    <Tooltip text={label} type="label" direction="e">
      <RouteLink
        route={route}
        className={styles["link"]}
        aria-current={isActive ? "page" : undefined}
        onNavigate={onNavigate}
      >
        <span className={styles["markerArea"]}>
          <StepMarker number={number} isActive={isActive} progress={progress} />
          {attention !== "normal" && (
            <span className={styles["attention"]}>
              <AttentionIcon attention={attention} hasTooltip={false} />
            </span>
          )}
          {firstPersonHere && (
            <span className={styles["presence"]} aria-hidden>
              <InitialsAvatar
                name={firstPersonHere.name}
                label={firstPersonHere.label}
                colorIndex={firstPersonHere.colorIndex}
                size="small"
              />
            </span>
          )}
        </span>
      </RouteLink>
    </Tooltip>
  );
}
