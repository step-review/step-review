import { useEffect, useState } from "react";
import type StepFileView from "../review-view/StepFileView.ts";
import readingLineFileIndex from "./readingLineFileIndex.ts";

/**
 * The ID of the file being read, among a page's files in their order, as the
 * page scrolls (see `readingLineFileIndex`). `null` when none is.
 */
export default function useReadingLineFileId(
  stepFileViews: StepFileView[],
): string | null {
  const [readingLineFileId, setReadingLineFileId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    const fileCards = stepFileViews.flatMap((stepFileView) => {
      const element = document.getElementById(`file-${stepFileView.id}`);
      return element ? [{ fileId: stepFileView.id, element }] : [];
    });
    const update = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const isScrollable = scrollHeight > clientHeight;
      // Rounded up: the scroll position can be fractional on high-density
      // screens, stopping short of the bottom by less than a pixel.
      const isScrolledToBottom =
        isScrollable &&
        Math.ceil(window.scrollY + clientHeight) >= scrollHeight;
      const index = readingLineFileIndex(
        fileCards.map(({ element }) => element.getBoundingClientRect()),
        clientHeight,
        isScrolledToBottom,
      );
      setReadingLineFileId(index === null ? null : fileCards[index]!.fileId);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Cards that expand, collapse or finish rendering move the ones after them.
    const resizeObserver = new ResizeObserver(update);
    for (const { element } of fileCards) {
      resizeObserver.observe(element);
    }
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [stepFileViews]);
  return readingLineFileId;
}
