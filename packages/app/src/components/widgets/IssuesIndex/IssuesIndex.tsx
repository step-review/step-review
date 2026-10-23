import { Heading, Stack } from "@primer/react";
import { FormattedMessage } from "react-intl";
import formatNoteLocation from "../../../business-logic/notes/formatNoteLocation.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import SeverityBadge from "../../design-system/badges/SeverityBadge.tsx";
import NoteLink from "../NoteLink/NoteLink.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import styles from "./IssuesIndex.module.css";

/** Every issue of the review, grouped by step. */
export default function IssuesIndex() {
  const reviewView = useCurrentReviewView();
  const groups = reviewView.steps
    .map((step) => ({
      step,
      issues: [
        ...step.notes.map((note) => ({ note: note, location: null })),
        ...step.files.flatMap((file) =>
          file.notes.map((note) => ({
            note: note,
            location: formatNoteLocation(note, file.path),
          })),
        ),
      ].filter(({ note }) => note.kind === "issue"),
    }))
    .filter((group) => group.issues.length > 0);
  if (groups.length === 0) {
    return null;
  }
  return (
    <Stack gap="condensed">
      <Heading as="h2" variant="medium">
        <FormattedMessage defaultMessage="Issues" />
      </Heading>
      {groups.map(({ step, issues }) => (
        <div key={step.id}>
          <Heading as="h3" variant="small" className={styles["stepTitle"]}>
            {step.number}. <StepTitle step={step} />
          </Heading>
          <table className={styles["table"]}>
            <tbody>
              {issues.map(({ note, location }) => (
                <tr key={note.id}>
                  <td className={styles["fitCell"]}>
                    {note.kind === "issue" && (
                      <SeverityBadge severity={note.severity} />
                    )}
                  </td>
                  <td className={styles["fitCell"]}>
                    <NoteLink noteId={note.id} />
                  </td>
                  <td className={styles["summaryCell"]}>
                    <div className={styles["summary"]}>
                      {note.body.split("\n")[0]}
                    </div>
                    {location && (
                      <div className={styles["location"]}>{location}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </Stack>
  );
}
