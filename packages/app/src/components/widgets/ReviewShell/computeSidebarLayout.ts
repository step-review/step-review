/** Narrower, Primer stacks the sidebar above the content (48rem). */
const stackedLayoutMaxWidth = 768;

/** Also its initial width: the sidebar collapses rather than narrowing. */
const sidebarMinWidth = 400;

const sidebarMaxWidth = 600;

/**
 * Narrower, the content squeezes its header and diffs: the sidebar collapses
 * into the rail to keep the content at least this wide.
 */
const contentMinWidth = 720;

interface SidebarLayout {
  /** The sidebar is above the content, shown or hidden from a header. */
  isStacked: boolean;
  /** Beside the content, the full sidebar leaves the content enough room. */
  hasRoomForSidebar: boolean;
  /** How wide the full sidebar can be resized, beside the content. */
  sidebarWidthRange: { min: number; max: number };
}

/** How the sidebar fits beside the content, for a viewport width. */
export default function computeSidebarLayout(
  viewportWidth: number,
): SidebarLayout {
  const widthLeftByContent = viewportWidth - contentMinWidth;
  return {
    isStacked: viewportWidth < stackedLayoutMaxWidth,
    hasRoomForSidebar: widthLeftByContent >= sidebarMinWidth,
    sidebarWidthRange: {
      min: sidebarMinWidth,
      max: Math.max(
        sidebarMinWidth,
        Math.min(sidebarMaxWidth, widthLeftByContent),
      ),
    },
  };
}
