import * as v from "valibot";

export default v.pipe(v.number(), v.integer(), v.minValue(1));
