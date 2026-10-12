import { Anchor } from "@mantine/core";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import resolveReviewLink from "../../../business-logic/rounds/resolveReviewLink.ts";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import useNoteIndex from "../../../business-logic/rounds/useNoteIndex.ts";
import Markdown from "../../design-system/Markdown/Markdown.tsx";

interface Props {
  children: string;
}

/** Markdown from the review, with links to notes, steps and files. */
export default function ReviewMarkdown({ children }: Props) {
  const roundView = useCurrentRoundView();
  const noteIndex = useNoteIndex();
  return (
    <Markdown
      renderCustomLink={(href, linkChildren) => {
        const resolved = resolveReviewLink(href, roundView, noteIndex);
        if (!resolved) {
          return null;
        }
        const fragment = resolved.fragment ?? undefined;
        return (
          <Anchor
            href={`${routeHref(resolved.route)}${fragment ? `#${encodeURIComponent(fragment)}` : ""}`}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(resolved.route, fragment);
            }}
          >
            {linkChildren}
          </Anchor>
        );
      }}
    >
      {children}
    </Markdown>
  );
}
