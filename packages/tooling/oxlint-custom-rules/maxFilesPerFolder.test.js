import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import maxFilesPerFolder from "./maxFilesPerFolder.js";

// Setup SUT
RuleTester.describe = describe;
RuleTester.it = it;
const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: "ts" } },
});

// Exercise and verify
ruleTester.run("max-files-per-folder", maxFilesPerFolder, {
  valid: [
    {
      name: "excludes test files from the folder limit",
      code: "",
      options: [{ max: 2 }],
      before() {
        // Setup SUT
        const directory = mkdtempSync(join(tmpdir(), "folder-limit-valid-"));
        this.filename = join(directory, "Alpha.ts");
        writeFileSync(this.filename, "");
        writeFileSync(join(directory, "Beta.ts"), "");
        writeFileSync(join(directory, "Gamma.test.ts"), "");
      },
      after() {
        if (this.filename) {
          rmSync(dirname(this.filename), { recursive: true, force: true });
        }
      },
    },
  ],
  invalid: [
    {
      name: "reports folders exceeding the non-test file limit",
      code: "",
      options: [{ max: 1 }],
      errors: [{ messageId: "tooMany", data: { fileCount: 2, maximum: 1 } }],
      before() {
        // Setup SUT
        const directory = mkdtempSync(join(tmpdir(), "folder-limit-invalid-"));
        this.filename = join(directory, "Alpha.ts");
        writeFileSync(this.filename, "");
        writeFileSync(join(directory, "Beta.ts"), "");
        writeFileSync(join(directory, "Gamma.test.ts"), "");
      },
      after() {
        if (this.filename) {
          rmSync(dirname(this.filename), { recursive: true, force: true });
        }
      },
    },
  ],
});
