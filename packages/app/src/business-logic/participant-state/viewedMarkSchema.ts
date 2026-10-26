import * as v from "valibot";

/** A participant marking a file as viewed or not viewed. */
export default v.object({
  fingerprint: v.string(),
  viewed: v.boolean(),
  /** When, in milliseconds: the latest mark of a file wins. */
  at: v.pipe(v.number(), v.safeInteger(), v.minValue(0)),
});
