import { Heading, Label, Link } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import issueSeverities from "../../../business-logic/notes/issueSeverities.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import severityLabelVariants from "../../design-system/badges/severityLabelVariants.ts";
import RouteLink from "../RouteLink/RouteLink.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import styles from "./IssuesByStep.module.css";

/**
 * How many issues of each severity every step has, to see at a glance where
 * they are. The issues themselves are read in the steps.
 */
export default function IssuesByStep() {
  const intl = useIntl();
  const { reviewAddress, steps } = useCurrentReviewView();
  const totalCounts = countNotes(collectNotes(steps)).issueCountsBySeverity;
  const presentSeverities = issueSeverities.filter(
    (severity) => totalCounts[severity] > 0,
  );
  if (presentSeverities.length === 0) {
    return null;
  }
  const severityTitles = {
    blocker: intl.formatMessage({ defaultMessage: "Blockers" }),
    concern: intl.formatMessage({ defaultMessage: "Concerns" }),
    question: intl.formatMessage({ defaultMessage: "Questions" }),
    nit: intl.formatMessage({ defaultMessage: "Nits" }),
  };
  return (
    <section
      aria-labelledby="issues-by-step-title"
      className={styles["issuesByStep"]}
    >
      <Heading
        as="h2"
        variant="small"
        id="issues-by-step-title"
        className={styles["title"]}
      >
        <FormattedMessage defaultMessage="Issue breakdown" />
      </Heading>
      <table className={styles["table"]}>
        <thead>
          <tr>
            <th className={styles["stepHeader"]}>
              <FormattedMessage defaultMessage="Step" />
            </th>
            {presentSeverities.map((severity) => (
              <th key={severity} className={styles["countHeader"]}>
                {severityTitles[severity]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => {
            const issueCountsBySeverity = countNotes(
              collectNotes([step]),
            ).issueCountsBySeverity;
            const route: NavigableRoute = {
              name: RouteName.Step,
              reviewAddress,
              stepId: step.id,
            };
            return (
              <tr key={step.id}>
                <td>
                  <Link
                    as={RouteLink}
                    route={route}
                    className={styles["stepLink"]}
                  >
                    {step.number}. <StepTitle step={step} />
                  </Link>
                </td>
                {presentSeverities.map((severity) => (
                  <td key={severity} className={styles["countCell"]}>
                    {issueCountsBySeverity[severity] > 0 && (
                      <Label variant={severityLabelVariants[severity]}>
                        {issueCountsBySeverity[severity]}
                      </Label>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
