import { useEffect, useState } from "react";
import type StepFileView from "../review-view/StepFileView.ts";
import FragmentScroll from "./FragmentScroll.ts";
import useTopFileId from "./useTopFileId.ts";

interface FragmentScrollStop {
  fileId: string;
  scrollY: number;
}

/**
 * The ID of the file being viewed, among a page's files in their order: the one
 * a link last scrolled to, until the page scrolls on, then the one whose card
 * is closest to the top of the viewport. The link's file wins because the page
 * can't always bring its card to the top, e.g. a short one at the end. `null`
 * when no file is in view.
 */
export default function useCurrentFileId(
  stepFileViews: StepFileView[],
): string | null {
  const topFileId = useTopFileId(stepFileViews);
  const [fragmentScrollStop, setFragmentScrollStop] =
    useState<FragmentScrollStop | null>(null);
  useEffect(
    () =>
      FragmentScroll.listen((fragment) => {
        // The file's card, or one of its notes.
        const stepFileView = stepFileViews.find(
          (file) =>
            fragment === `file-${file.id}` ||
            file.notes.some((note) => fragment === `note-${note.id}`),
        );
        setFragmentScrollStop(
          stepFileView
            ? { fileId: stepFileView.id, scrollY: window.scrollY }
            : null,
        );
      }),
    [stepFileViews],
  );
  useEffect(() => {
    if (!fragmentScrollStop) {
      return;
    }
    const onScroll = () => {
      if (window.scrollY !== fragmentScrollStop.scrollY) {
        setFragmentScrollStop(null);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fragmentScrollStop]);
  return fragmentScrollStop?.fileId ?? topFileId;
}
