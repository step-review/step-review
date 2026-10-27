import { expect, it } from "vitest";
import lineNumberDigitCount from "./lineNumberDigitCount.ts";

it("counts the digits of the largest line number on either side", () => {
  // Exercise
  const digitCount = lineNumberDigitCount([
    {
      oldStart: 98,
      oldLineCount: 2,
      newStart: 98,
      newLineCount: 3,
      heading: "",
      lines: [
        {
          type: "context",
          content: "a",
          oldLineNumber: 98,
          newLineNumber: 98,
          noNewlineAtEnd: false,
        },
        {
          type: "deletion",
          content: "b",
          oldLineNumber: 99,
          newLineNumber: null,
          noNewlineAtEnd: false,
        },
        {
          type: "addition",
          content: "c",
          oldLineNumber: null,
          newLineNumber: 99,
          noNewlineAtEnd: false,
        },
        {
          type: "addition",
          content: "d",
          oldLineNumber: null,
          newLineNumber: 100,
          noNewlineAtEnd: false,
        },
      ],
    },
  ]);

  // Verify
  expect(digitCount).toBe(3);
});

it("counts the digits of an added file's last line", () => {
  // Exercise
  const digitCount = lineNumberDigitCount([
    {
      oldStart: 0,
      oldLineCount: 0,
      newStart: 1,
      newLineCount: 2,
      heading: "",
      lines: [
        {
          type: "addition",
          content: "a",
          oldLineNumber: null,
          newLineNumber: 1,
          noNewlineAtEnd: false,
        },
        {
          type: "addition",
          content: "b",
          oldLineNumber: null,
          newLineNumber: 2,
          noNewlineAtEnd: false,
        },
      ],
    },
  ]);

  // Verify
  expect(digitCount).toBe(1);
});
