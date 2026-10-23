import type StepView from "./StepView.ts";

export default function countViewedFiles(
  steps: StepView[],
  viewedFingerprints: Set<string>,
): { viewedCount: number; totalCount: number } {
  const files = steps.flatMap((step) => step.files);
  return {
    viewedCount: files.filter((file) =>
      viewedFingerprints.has(file.fingerprint),
    ).length,
    totalCount: files.length,
  };
}
