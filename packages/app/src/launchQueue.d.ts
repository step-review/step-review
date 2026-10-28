// The File Handling API, which TypeScript's DOM library doesn't include yet.
// Only Chromium-based browsers implement it.

declare global {
  interface LaunchParams {
    files: FileSystemFileHandle[];
  }

  interface LaunchQueue {
    setConsumer(consumer: (launchParams: LaunchParams) => void): void;
  }

  interface Window {
    launchQueue?: LaunchQueue;
  }
}

export {};
