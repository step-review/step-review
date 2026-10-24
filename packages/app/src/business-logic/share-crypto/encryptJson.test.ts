import * as v from "valibot";
import { expect, it } from "vitest";
import decryptJson from "./decryptJson.ts";
import encryptJson from "./encryptJson.ts";
import importShareKey from "./importShareKey.ts";
import randomBase64Url from "./randomBase64Url.ts";

it("decrypts a value encrypted with the same key and additional data", async () => {
  // Setup SUT
  const shareKey = (await importShareKey(randomBase64Url(32)))!;
  const encryptedJson = await encryptJson(
    shareKey,
    { name: "Ada" },
    "state:alice",
  );

  // Exercise
  const value = await decryptJson(
    shareKey,
    encryptedJson,
    "state:alice",
    v.object({ name: v.string() }),
  );

  // Verify
  expect(value).toEqual({ name: "Ada" });
});

it("refuses to decrypt with another key", async () => {
  // Setup SUT
  const encryptedJson = await encryptJson(
    (await importShareKey(randomBase64Url(32)))!,
    { name: "Ada" },
    "state:alice",
  );

  // Exercise
  const value = await decryptJson(
    (await importShareKey(randomBase64Url(32)))!,
    encryptedJson,
    "state:alice",
    v.object({ name: v.string() }),
  );

  // Verify
  expect(value).toBeNull();
});

it("refuses to decrypt a value passed off as another one", async () => {
  // Setup SUT
  const shareKey = (await importShareKey(randomBase64Url(32)))!;
  const encryptedJson = await encryptJson(
    shareKey,
    { name: "Ada" },
    "state:alice",
  );

  // Exercise
  const value = await decryptJson(
    shareKey,
    encryptedJson,
    "state:bob",
    v.object({ name: v.string() }),
  );

  // Verify
  expect(value).toBeNull();
});

it("refuses a decrypted value that doesn't match the schema", async () => {
  // Setup SUT
  const shareKey = (await importShareKey(randomBase64Url(32)))!;
  const encryptedJson = await encryptJson(
    shareKey,
    { name: 42 },
    "state:alice",
  );

  // Exercise
  const value = await decryptJson(
    shareKey,
    encryptedJson,
    "state:alice",
    v.object({ name: v.string() }),
  );

  // Verify
  expect(value).toBeNull();
});
