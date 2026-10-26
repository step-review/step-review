import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Throttle from "./Throttle.ts";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("runs the first request right away", () => {
  // Setup mocks
  const callback = vi.fn();

  // Setup SUT
  const throttle = new Throttle(callback, 500);

  // Exercise
  throttle.request();

  // Verify
  expect(callback).toHaveBeenCalledOnce();
});

it("runs the requests made within the interval once, at its end", () => {
  // Setup mocks
  const callback = vi.fn();

  // Setup SUT
  const throttle = new Throttle(callback, 500);
  throttle.request();

  // Exercise
  vi.advanceTimersByTime(100);
  throttle.request();
  throttle.request();
  vi.advanceTimersByTime(399);
  const callCountBeforeEnd = callback.mock.calls.length;
  vi.advanceTimersByTime(1);

  // Verify
  expect([callCountBeforeEnd, callback.mock.calls.length]).toEqual([1, 2]);
});

it("doesn't run a deferred request once canceled", () => {
  // Setup mocks
  const callback = vi.fn();

  // Setup SUT
  const throttle = new Throttle(callback, 500);
  throttle.request();

  // Exercise
  throttle.request();
  throttle.cancel();
  vi.advanceTimersByTime(500);

  // Verify
  expect(callback).toHaveBeenCalledOnce();
});
