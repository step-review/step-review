import { Link } from "@primer/react";
import resolveReviewLink from "../../../business-logic/review-view/resolveReviewLink.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useNoteIndex from "../../../business-logic/review-view/useNoteIndex.ts";
import RouteLink from "../RouteLink/RouteLink.tsx";
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
      as={RouteLink}
      className={styles["id"]}
      route={resolved.route}
      fragment={`note-${noteId}`}
    >
      {noteId}
    </Link>
  );
}
