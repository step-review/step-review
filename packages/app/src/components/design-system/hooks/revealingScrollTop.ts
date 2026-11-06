interface VerticalExtent {
  top: number;
  bottom: number;
}

/**
 * The scroll position at which a scroll area shows an item it contains, at
 * least `margin` from its edges, moving as little as possible: unchanged when
 * the item already shows, and against the nearer edge otherwise. An item too
 * tall for the margins shows its top. The extents are in the same coordinates,
 * e.g. the viewport's.
 */
export default function revealingScrollTop(
  item: VerticalExtent,
  scrollArea: VerticalExtent,
  scrollTop: number,
  margin: number,
): number {
  const areaHeight = scrollArea.bottom - scrollArea.top;
  const itemHeight = item.bottom - item.top;
  const fittingMargin = Math.max(
    0,
    Math.min(margin, (areaHeight - itemHeight) / 2),
  );
  const topGap = item.top - scrollArea.top;
  const bottomGap = scrollArea.bottom - item.bottom;
  if (topGap < fittingMargin) {
    return scrollTop + topGap - fittingMargin;
  }
  if (bottomGap < fittingMargin) {
    // Never so far that the top goes past the margin.
    return (
      scrollTop + Math.min(fittingMargin - bottomGap, topGap - fittingMargin)
    );
  }
  return scrollTop;
}
