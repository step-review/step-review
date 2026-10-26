/* oxlint-disable architecture/public-exports -- Keep the dialog's state and its hook together. */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface CollaborationSessionDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CollaborationSessionDialogContext =
  createContext<CollaborationSessionDialogState | null>(null);

interface Props {
  children: ReactNode;
}

/**
 * Keeps the collaboration session dialog open while the page switches from the
 * local review to the session just started, which remounts the review's
 * components.
 */
export default function CollaborationSessionDialogProvider({
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const collaborationSessionDialogState = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );
  return (
    <CollaborationSessionDialogContext value={collaborationSessionDialogState}>
      {children}
    </CollaborationSessionDialogContext>
  );
}

/** Whether the collaboration session dialog is open, and how to change it. */
export function useCollaborationSessionDialogState(): CollaborationSessionDialogState {
  const collaborationSessionDialogState = useContext(
    CollaborationSessionDialogContext,
  );
  // Rendered outside the provider, the dialog couldn't stay open across the
  // switch to the session.
  if (!collaborationSessionDialogState) {
    throw new Error("CollaborationSessionDialogProvider is missing.");
  }
  return collaborationSessionDialogState;
}
