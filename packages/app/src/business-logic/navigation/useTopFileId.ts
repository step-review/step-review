import { useEffect, useState } from "react";
import type StepFileView from "../review-view/StepFileView.ts";

/**
 * The ID of the file whose card is closest to the top of the viewport, among a
 * page's files in their order; `null` when none is in view. Unlike the URL
 * fragment, it follows scrolling.
 */
export default function useTopFileId(
  stepFileViews: StepFileView[],
): string | null {
  const [topFileId, setTopFileId] = useState<string | null>(null);
  useEffect(() => {
    const fileElements = stepFileViews.map((stepFileView) =>
      document.getElementById(`file-${stepFileView.id}`),
    );
    const visibleFileElements = new Set<Element>();
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleFileElements.add(entry.target);
        } else {
          visibleFileElements.delete(entry.target);
        }
      }
      // A card partly scrolled past the top still intersects, so the first
      // visible one in order is the top one.
      const topIndex = fileElements.findIndex(
        (fileElement) => fileElement && visibleFileElements.has(fileElement),
      );
      setTopFileId(stepFileViews[topIndex]?.id ?? null);
    });
    for (const fileElement of fileElements) {
      if (fileElement) {
        intersectionObserver.observe(fileElement);
      }
    }
    return () => intersectionObserver.disconnect();
  }, [stepFileViews]);
  return topFileId;
}
