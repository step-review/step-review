import "vite/client";

declare global {
  /** The app's version, e.g. `1.2.3`, or `1.2.3-pr.45` for a PR preview. */
  const __APP_VERSION__: string;
}
