/** Files QA hands over to the publish job, next to the CLI's package. */
export default {
  packDirectory: new URL("../../.pack/", import.meta.url),
  plan: new URL("../../.release/plan.json", import.meta.url),
  sealedTarball: new URL("../../.release/tarball.json", import.meta.url),
};
