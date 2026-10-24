import { expect, it } from "vitest";
import importShareKey from "./importShareKey.ts";

it.each(["", "not base64!", "c2hvcnQ"])(
  "refuses %j as a share key",
  async (shareKey) => {
    // Exercise
    const cryptoKey = await importShareKey(shareKey);

    // Verify
    expect(cryptoKey).toBeNull();
  },
);
