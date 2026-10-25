import type ViewedMark from "./ViewedMark.ts";

type ParticipantStateAction =
  | { type: "rename"; name: string }
  | { type: "addViewedMarks"; viewedMarks: ViewedMark[] };

export default ParticipantStateAction;
