import isOnMain from "./isOnMain.ts";
import workspaceVersion from "./workspaceVersion.ts";

// Run in CI before deploying a release tag.
const tag = process.env["GITHUB_REF_NAME"];
const version = workspaceVersion.read();
if (tag !== `v${version}`) {
  throw new Error(`The tag ${tag} doesn't match the version ${version}.`);
}
if (!isOnMain(process.env["GITHUB_SHA"] ?? "")) {
  throw new Error(`The tag ${tag} isn't on main.`);
}
console.log(`Releasing ${version}.`);
