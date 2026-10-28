import { Link } from "@primer/react";
import resolveReviewLink from "../../../business-logic/review-view/resolveReviewLink.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useNoteIndex from "../../../business-logic/review-view/useNoteIndex.ts";
import Markdown from "../../design-system/Markdown/Markdown.tsx";
import RouteLink from "../RouteLink/RouteLink.tsx";

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
        return (
          <Link
            as={RouteLink}
            inline
            route={resolved.route}
            fragment={resolved.fragment ?? undefined}
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
