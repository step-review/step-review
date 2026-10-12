import { Anchor, Text } from "@mantine/core";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import resolveReviewLink from "../../../business-logic/rounds/resolveReviewLink.ts";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import useNoteIndex from "../../../business-logic/rounds/useNoteIndex.ts";

interface Props {
  noteId: string;
}

export default function NoteLink({ noteId }: Props) {
  const roundView = useCurrentRoundView();
  const resolved = resolveReviewLink(
    `note:${noteId}`,
    roundView,
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
