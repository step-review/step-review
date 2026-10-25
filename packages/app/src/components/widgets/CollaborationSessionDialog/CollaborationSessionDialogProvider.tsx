/* oxlint-disable architecture/public-exports -- Keep the dialog's open state and its hook together. */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type CollaborationSessionDialogState = [
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
];

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
  const collaborationSessionDialogState = useState(false);
  return (
    <CollaborationSessionDialogContext value={collaborationSessionDialogState}>
      {children}
    </CollaborationSessionDialogContext>
  );
}

/**
 * Whether the collaboration session dialog is open, and how to open or close
 * it.
 */
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
