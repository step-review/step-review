/* oxlint-disable architecture/public-exports -- Keep the dialog's state and its hook together. */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface CollaborationSessionDialogState {
  isOpen: boolean;
  /** The link copied to the clipboard when the session started, if it was. */
  copiedLink: string | null;
  open: () => void;
  close: () => void;
  setCopiedLink: (copiedLink: string) => void;
}

const CollaborationSessionDialogContext =
  createContext<CollaborationSessionDialogState | null>(null);

interface Props {
  children: ReactNode;
}

/**
 * Keeps the collaboration session dialog open, and whether its link was copied,
 * while the page switches from the local review to the session just started,
 * which remounts the review's components.
 */
export default function CollaborationSessionDialogProvider({
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const collaborationSessionDialogState = useMemo(
    () => ({
      isOpen,
      copiedLink,
      open: () => setIsOpen(true),
      close: () => {
        setIsOpen(false);
        setCopiedLink(null);
      },
      setCopiedLink,
    }),
    [isOpen, copiedLink],
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
