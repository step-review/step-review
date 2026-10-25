import type OwnStateSync from "./OwnStateSync.ts";

export default function emptyOwnStateSync(): OwnStateSync {
  return {
    revision: 0,
    storedState: null,
    pendingActions: [],
    inFlightWrite: null,
  };
}
