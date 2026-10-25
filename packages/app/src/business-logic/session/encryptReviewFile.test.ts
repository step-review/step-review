import { expect, it } from "vitest";
import importSessionKey from "../session-crypto/importSessionKey.ts";
import randomBase64Url from "../session-crypto/randomBase64Url.ts";
import decryptReviewFile from "./decryptReviewFile.ts";
import encryptReviewFile from "./encryptReviewFile.ts";

it("decrypts the review file of the same session", async () => {
  // Setup SUT
  const sessionKey = (await importSessionKey(randomBase64Url(32)))!;
  const encryptedReviewFile = await encryptReviewFile(
    sessionKey,
    "Qx2mT9vK4pLw8nR1sYb7Ze",
    { fileName: "pr-12.step-review", text: "review text" },
  );

  // Exercise
  const sessionReviewFile = await decryptReviewFile(
    sessionKey,
    "Qx2mT9vK4pLw8nR1sYb7Ze",
    encryptedReviewFile,
  );

  // Verify
  expect(sessionReviewFile).toEqual({
    fileName: "pr-12.step-review",
    text: "review text",
  });
});

it("refuses a review file encrypted for another session", async () => {
  // Setup SUT
  const sessionKey = (await importSessionKey(randomBase64Url(32)))!;
  const encryptedReviewFile = await encryptReviewFile(
    sessionKey,
    "Qx2mT9vK4pLw8nR1sYb7Ze",
    { fileName: "pr-12.step-review", text: "review text" },
  );

  // Exercise
  const sessionReviewFile = await decryptReviewFile(
    sessionKey,
    "Hk3nP8wQ5rTz2mV6sXc9Ab",
    encryptedReviewFile,
  );

  // Verify
  expect(sessionReviewFile).toBeNull();
});
