/** Files QA hands over to the publish job, next to the CLI's package. */
export default {
  packDirectory: new URL("../../../cli/.pack/", import.meta.url),
  plan: new URL("../../../cli/.release/plan.json", import.meta.url),
  sealedTarball: new URL("../../../cli/.release/tarball.json", import.meta.url),
};
