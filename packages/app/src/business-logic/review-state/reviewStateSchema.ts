import * as v from "valibot";

const commentTargetSchema = v.variant("kind", [
  v.object({ kind: v.literal("step"), stepId: v.string() }),
  v.object({ kind: v.literal("file"), stepId: v.string(), path: v.string() }),
  v.object({
    kind: v.literal("line"),
    stepId: v.string(),
    path: v.string(),
    side: v.picklist(["old", "new"]),
    line: v.number(),
    lineText: v.string(),
  }),
]);

export default v.object({
  viewedFingerprints: v.array(v.string()),
  issueVerdicts: v.record(
    v.string(),
    v.object({
      verdict: v.nullable(v.picklist(["accepted", "dismissed"])),
      reply: v.string(),
    }),
  ),
  comments: v.array(
    v.object({
      id: v.string(),
      roundNumber: v.number(),
      target: commentTargetSchema,
      body: v.string(),
      createdAt: v.string(),
    }),
  ),
});
