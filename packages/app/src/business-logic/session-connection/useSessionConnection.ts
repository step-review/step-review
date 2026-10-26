import { useEffect, useState } from "react";
import SessionConnection from "./SessionConnection.ts";
import type SessionConnectionOptions from "./SessionConnectionOptions.ts";

/** A connection to a session, open while the component is mounted. */
export default function useSessionConnection({
  apiOrigin,
  sessionId,
  sessionKey,
  participantId,
  participantSecret,
}: SessionConnectionOptions): SessionConnection | null {
  const [sessionConnection, setSessionConnection] =
    useState<SessionConnection | null>(null);
  useEffect(() => {
    const newSessionConnection = new SessionConnection({
      apiOrigin,
      sessionId,
      sessionKey,
      participantId,
      participantSecret,
    });
    setSessionConnection(newSessionConnection);
    return () => {
      newSessionConnection.close();
      setSessionConnection(null);
    };
  }, [apiOrigin, sessionId, sessionKey, participantId, participantSecret]);
  return sessionConnection;
}
