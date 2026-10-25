/* oxlint-disable architecture/public-exports -- Keep the session connection context and its hook together. */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import type SessionConnection from "./SessionConnection.ts";
import type SessionConnectionSnapshot from "./SessionConnectionSnapshot.ts";

interface SessionConnectionContextValue {
  sessionBookmark: SessionBookmark;
  /** The imported key of the session, e.g. to upload a new version. */
  sessionKey: CryptoKey;
  sessionConnection: SessionConnection;
  sessionConnectionSnapshot: SessionConnectionSnapshot;
}

const SessionConnectionContext =
  createContext<SessionConnectionContextValue | null>(null);

interface Props {
  value: SessionConnectionContextValue;
  children: ReactNode;
}

/** Provides the connection to the session being displayed. */
export default function SessionConnectionProvider({ value, children }: Props) {
  return (
    <SessionConnectionContext value={value}>
      {children}
    </SessionConnectionContext>
  );
}

/** The connection to the session being displayed; `null` for local ones. */
export function useSessionConnectionContext(): SessionConnectionContextValue | null {
  return useContext(SessionConnectionContext);
}
