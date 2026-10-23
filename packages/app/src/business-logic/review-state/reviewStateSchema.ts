import * as v from "valibot";

export default v.object({
  viewedFingerprints: v.array(v.string()),
});
