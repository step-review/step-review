import { Anchor, Text } from "@mantine/core";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import resolveReviewLink from "../../../business-logic/review-view/resolveReviewLink.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useNoteIndex from "../../../business-logic/review-view/useNoteIndex.ts";

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
    return (
      <Text span ff="monospace" size="sm">
        {noteId}
      </Text>
    );
  }
  return (
    <Anchor
      ff="monospace"
      size="sm"
      href={`${routeHref(resolved.route)}#note-${encodeURIComponent(noteId)}`}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(resolved.route, `note-${noteId}`);
      }}
    >
      {noteId}
    </Anchor>
  );
}
