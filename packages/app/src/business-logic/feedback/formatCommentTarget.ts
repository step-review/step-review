import type CommentTarget from "../review-state/CommentTarget.ts";

export default function formatCommentTarget(target: CommentTarget): string {
  switch (target.kind) {
    case "step":
      return `step \`${target.stepId}\``;
    case "file":
      return `\`${target.path}\``;
    case "line":
      return `\`${target.path}:${target.line}\`${target.side === "old" ? " (base version)" : ""}`;
  }
}
