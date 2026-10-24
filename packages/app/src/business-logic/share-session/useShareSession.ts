import { useEffect, useState } from "react";
import ShareSession from "./ShareSession.ts";
import type ShareSessionOptions from "./ShareSessionOptions.ts";

/** A session to a share, open while the component is mounted. */
export default function useShareSession({
  apiOrigin,
  shareId,
  shareKey,
  participantId,
  participantSecret,
}: ShareSessionOptions): ShareSession | null {
  const [shareSession, setShareSession] = useState<ShareSession | null>(null);
  useEffect(() => {
    const newShareSession = new ShareSession({
      apiOrigin,
      shareId,
      shareKey,
      participantId,
      participantSecret,
    });
    setShareSession(newShareSession);
    return () => {
      newShareSession.close();
      setShareSession(null);
    };
  }, [apiOrigin, shareId, shareKey, participantId, participantSecret]);
  return shareSession;
}
