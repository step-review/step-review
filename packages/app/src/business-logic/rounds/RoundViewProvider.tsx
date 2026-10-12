/* oxlint-disable architecture/public-exports -- Keep the round view context and its hook together. */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type RoundView from "./RoundView.ts";

const RoundViewContext = createContext<RoundView | null>(null);

interface Props {
  roundView: RoundView;
  children: ReactNode;
}

/** Provides the round being displayed to the components of a review page. */
export default function RoundViewProvider({ roundView, children }: Props) {
  return <RoundViewContext value={roundView}>{children}</RoundViewContext>;
}

export function useCurrentRoundView(): RoundView {
  const roundView = useContext(RoundViewContext);
  if (!roundView) {
    throw new Error(
      "useCurrentRoundView must be used inside RoundViewProvider.",
    );
  }
  return roundView;
}
