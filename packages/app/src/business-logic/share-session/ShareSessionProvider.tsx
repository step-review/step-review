/* oxlint-disable architecture/public-exports -- Keep the share session context and its hook together. */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import type ShareSession from "./ShareSession.ts";
import type ShareSessionSnapshot from "./ShareSessionSnapshot.ts";

interface ShareSessionContextValue {
  shareBookmark: ShareBookmark;
  shareSession: ShareSession;
  shareSessionSnapshot: ShareSessionSnapshot;
}

const ShareSessionContext = createContext<ShareSessionContextValue | null>(
  null,
);

interface Props {
  value: ShareSessionContextValue;
  children: ReactNode;
}

/** Provides the session of the shared review being displayed. */
export default function ShareSessionProvider({ value, children }: Props) {
  return <ShareSessionContext value={value}>{children}</ShareSessionContext>;
}

/** The session of the shared review being displayed; `null` for local ones. */
export function useShareSessionContext(): ShareSessionContextValue | null {
  return useContext(ShareSessionContext);
}
