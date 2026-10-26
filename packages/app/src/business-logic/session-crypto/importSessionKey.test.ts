import { expect, it } from "vitest";
import importSessionKey from "./importSessionKey.ts";

it.each(["", "not base64!", "c2hvcnQ"])(
  "refuses %j as a session key",
  async (sessionKey) => {
    // Exercise
    const cryptoKey = await importSessionKey(sessionKey);

    // Verify
    expect(cryptoKey).toBeNull();
  },
);
