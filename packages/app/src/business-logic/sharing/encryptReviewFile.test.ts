import { expect, it } from "vitest";
import importShareKey from "../share-crypto/importShareKey.ts";
import randomBase64Url from "../share-crypto/randomBase64Url.ts";
import decryptReviewFile from "./decryptReviewFile.ts";
import encryptReviewFile from "./encryptReviewFile.ts";

it("decrypts the review file of the same share", async () => {
  // Setup SUT
  const shareKey = (await importShareKey(randomBase64Url(32)))!;
  const encryptedReviewFile = await encryptReviewFile(
    shareKey,
    "Qx2mT9vK4pLw8nR1sYb7Ze",
    { fileName: "pr-12.step-review", text: "review text" },
  );

  // Exercise
  const sharedReviewFile = await decryptReviewFile(
    shareKey,
    "Qx2mT9vK4pLw8nR1sYb7Ze",
    encryptedReviewFile,
  );

  // Verify
  expect(sharedReviewFile).toEqual({
    fileName: "pr-12.step-review",
    text: "review text",
  });
});

it("refuses a review file encrypted for another share", async () => {
  // Setup SUT
  const shareKey = (await importShareKey(randomBase64Url(32)))!;
  const encryptedReviewFile = await encryptReviewFile(
    shareKey,
    "Qx2mT9vK4pLw8nR1sYb7Ze",
    { fileName: "pr-12.step-review", text: "review text" },
  );

  // Exercise
  const sharedReviewFile = await decryptReviewFile(
    shareKey,
    "Hk3nP8wQ5rTz2mV6sXc9Ab",
    encryptedReviewFile,
  );

  // Verify
  expect(sharedReviewFile).toBeNull();
});
