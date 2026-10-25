/**
 * Runs a callback at most once per interval: a run requested within the
 * interval is deferred to its end, and the requests made meanwhile merge into
 * it.
 */
export default class Throttle {
  private callback: () => void;
  private interval: number;
  private ranAt = Number.NEGATIVE_INFINITY;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(callback: () => void, interval: number) {
    this.callback = callback;
    this.interval = interval;
  }

  request(): void {
    if (this.timeout !== null) {
      return;
    }
    const delay = this.ranAt + this.interval - Date.now();
    if (delay <= 0) {
      this.run();
    } else {
      this.timeout = setTimeout(() => this.run(), delay);
    }
  }

  cancel(): void {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private run(): void {
    this.timeout = null;
    this.ranAt = Date.now();
    this.callback();
  }
}
