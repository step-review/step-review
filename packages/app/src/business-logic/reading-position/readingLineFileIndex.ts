interface CardExtent {
  /** Relative to the top of the viewport. */
  top: number;
  bottom: number;
}

/**
 * The index of the file being read, given its cards' extents in the files'
 * order: the last card whose top is above a reading line, a third down the
 * viewport, so that a card scrolled almost out of view no longer counts. Once
 * the page is scrolled to the bottom, the last card whose top shows instead,
 * since a short card at the end may never reach the line. `null` when no card
 * reaches the line, e.g. while reading the step's introduction.
 */
export default function readingLineFileIndex(
  cardExtents: CardExtent[],
  viewportHeight: number,
  isScrolledToBottom: boolean,
): number | null {
  if (isScrolledToBottom) {
    const lastShowingTopIndex = cardExtents.findLastIndex(
      (cardExtent) => cardExtent.top >= 0 && cardExtent.top < viewportHeight,
    );
    if (lastShowingTopIndex !== -1) {
      return lastShowingTopIndex;
    }
  }
  const readingLine = viewportHeight / 3;
  const index = cardExtents.findLastIndex(
    (cardExtent) => cardExtent.top <= readingLine,
  );
  return index === -1 ? null : index;
}
