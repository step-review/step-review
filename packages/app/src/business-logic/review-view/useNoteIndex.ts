import { useMemo } from "react";
import { useLoadedReviewContext } from "../review/LoadedReviewValue.tsx";
import indexNotes from "./indexNotes.ts";
import type NoteLocation from "./NoteLocation.ts";

export default function useNoteIndex(): Map<string, NoteLocation> {
  const { loadedReview } = useLoadedReviewContext();
  return useMemo(
    () =>
      loadedReview
        ? indexNotes(loadedReview.reviewFile)
        : new Map<string, NoteLocation>(),
    [loadedReview],
  );
}
