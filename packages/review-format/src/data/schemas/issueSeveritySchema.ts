import * as v from "valibot";

export default v.pipe(
  v.picklist(["blocker", "concern", "question", "nit"]),
  v.description(
    "`blocker`: must be fixed before merging. `concern`: likely a problem. `question`: needs an answer from the author. `nit`: minor.",
  ),
);
