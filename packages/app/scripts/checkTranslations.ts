import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const appDir = join(import.meta.dirname, "..");
const translationsDir = join(appDir, "src/translations");
const temporaryDir = mkdtempSync(join(tmpdir(), "step-review-translations-"));

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function run(...args: string[]) {
  execFileSync("pnpm", args, { cwd: appDir, stdio: "inherit" });
}

try {
  const extractedPath = join(temporaryDir, "en.json");
  run("translations:extract", "--out-file", extractedPath);
  const englishMessages = readJson(extractedPath) as Record<
    string,
    { defaultMessage: string }
  >;
  assert.deepEqual(
    readJson(join(translationsDir, "en.json")),
    englishMessages,
    "English messages are out of date. Run translations:extract.",
  );
  for (const fileName of readdirSync(translationsDir).filter((name) =>
    name.endsWith(".json"),
  )) {
    const messages = readJson(join(translationsDir, fileName)) as Record<
      string,
      { defaultMessage: string }
    >;
    assert.deepEqual(
      Object.keys(messages).sort(),
      Object.keys(englishMessages).sort(),
      `${fileName} has missing or unused messages.`,
    );
    for (const message of Object.values(messages)) {
      assert.ok(
        message.defaultMessage.trim(),
        `${fileName} has an empty message.`,
      );
    }
  }
  run("translations:verify");
  const compiledDir = join(translationsDir, "compiled");
  const expectedCompiledDir = join(temporaryDir, "compiled");
  run(
    "exec",
    "formatjs",
    "compile-folder",
    "--ast",
    translationsDir,
    expectedCompiledDir,
  );
  assert.deepEqual(
    readdirSync(compiledDir).sort(),
    readdirSync(expectedCompiledDir).sort(),
    "Compiled locales are out of date. Run translations:compile.",
  );
  for (const fileName of readdirSync(expectedCompiledDir)) {
    assert.deepEqual(
      readJson(join(compiledDir, fileName)),
      readJson(join(expectedCompiledDir, fileName)),
      `${fileName} is out of date. Run translations:compile.`,
    );
  }
  console.log("Translation catalogs are complete and up to date.");
} finally {
  rmSync(temporaryDir, { recursive: true, force: true });
}
