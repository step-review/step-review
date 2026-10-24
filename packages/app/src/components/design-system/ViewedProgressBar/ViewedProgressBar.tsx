import { ProgressBar } from "@primer/react";

interface Props {
  viewedCount: number;
  totalCount: number;
}

/** How many files were viewed, green once all were. */
export default function ViewedProgressBar({ viewedCount, totalCount }: Props) {
  return (
    <ProgressBar
      barSize="small"
      aria-hidden
      progress={(viewedCount / Math.max(totalCount, 1)) * 100}
      bg={viewedCount === totalCount ? "success.emphasis" : "accent.emphasis"}
    />
  );
}
