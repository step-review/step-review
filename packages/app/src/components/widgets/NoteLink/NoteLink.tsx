import { Link } from "@primer/react";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import resolveReviewLink from "../../../business-logic/review-view/resolveReviewLink.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useNoteIndex from "../../../business-logic/review-view/useNoteIndex.ts";
import styles from "./NoteLink.module.css";

interface Props {
  noteId: string;
}

export default function NoteLink({ noteId }: Props) {
  const reviewView = useCurrentReviewView();
  const resolved = resolveReviewLink(
    `note:${noteId}`,
    reviewView,
    useNoteIndex(),
  );
  if (!resolved) {
    return <span className={styles["id"]}>{noteId}</span>;
  }
  return (
    <Link
      className={styles["id"]}
      href={routeHref(resolved.route, `note-${noteId}`)}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(resolved.route, `note-${noteId}`);
      }}
    >
      {noteId}
    </Link>
  );
}
