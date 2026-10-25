import { expect, it } from "vitest";
import participantNameStorageKey from "./participantNameStorageKey.ts";
import readParticipantName from "./readParticipantName.ts";

it("returns the name last used", () => {
  // Setup SUT
  window.localStorage.setItem(participantNameStorageKey, "Ada");

  // Exercise and verify
  expect(readParticipantName()).toBe("Ada");
});

it("picks a random name the first time, and returns it again later", () => {
  // Setup SUT
  window.localStorage.removeItem(participantNameStorageKey);

  // Exercise
  const firstName = readParticipantName();
  const secondName = readParticipantName();

  // Verify
  expect(firstName).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/u);
  expect(secondName).toBe(firstName);
});
