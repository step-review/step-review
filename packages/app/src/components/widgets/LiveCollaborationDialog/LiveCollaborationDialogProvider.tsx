/* oxlint-disable architecture/public-exports -- Keep the dialog's open state and its hook together. */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type LiveCollaborationDialogState = [
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
];

const LiveCollaborationDialogContext =
  createContext<LiveCollaborationDialogState | null>(null);

interface Props {
  children: ReactNode;
}

/**
 * Keeps the live collaboration dialog open while the page switches from the
 * local review to the session just started, which remounts the review's
 * components.
 */
export default function LiveCollaborationDialogProvider({ children }: Props) {
  const liveCollaborationDialogState = useState(false);
  return (
    <LiveCollaborationDialogContext value={liveCollaborationDialogState}>
      {children}
    </LiveCollaborationDialogContext>
  );
}

/** Whether the live collaboration dialog is open, and how to open or close it. */
export function useLiveCollaborationDialogState(): LiveCollaborationDialogState {
  const liveCollaborationDialogState = useContext(
    LiveCollaborationDialogContext,
  );
  // Rendered outside the provider, the dialog couldn't stay open across the
  // switch to the session.
  if (!liveCollaborationDialogState) {
    throw new Error("LiveCollaborationDialogProvider is missing.");
  }
  return liveCollaborationDialogState;
}
