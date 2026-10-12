import type StepFileView from "../rounds/StepFileView.ts";
import type StepView from "../rounds/StepView.ts";

export default interface FileTreeNode {
  value: string;
  label: string;
  children: FileTreeNode[];
  /** Set on leaves: a file in a step. */
  file: { stepView: StepView; stepFileView: StepFileView } | null;
}
