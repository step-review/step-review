import { Link } from "@primer/react";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import resolveReviewLink from "../../../business-logic/review-view/resolveReviewLink.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useNoteIndex from "../../../business-logic/review-view/useNoteIndex.ts";
import Markdown from "../../design-system/Markdown/Markdown.tsx";

interface Props {
  children: string;
  size?: "medium" | "large";
}

/** Markdown from the review, with links to notes, steps and files. */
export default function ReviewMarkdown({ children, size }: Props) {
  const reviewView = useCurrentReviewView();
  const noteIndex = useNoteIndex();
  return (
    <Markdown
      size={size}
      renderCustomLink={(href, linkChildren) => {
        const resolved = resolveReviewLink(href, reviewView, noteIndex);
        if (!resolved) {
          return null;
        }
        const fragment = resolved.fragment ?? undefined;
        return (
          <Link
            inline
            href={routeHref(resolved.route, fragment)}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(resolved.route, fragment);
            }}
          >
            {linkChildren}
          </Link>
        );
      }}
    >
      {children}
    </Markdown>
  );
}
