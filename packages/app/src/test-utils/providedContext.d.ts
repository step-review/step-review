import "vitest";

declare module "vitest" {
  export interface ProvidedContext {
    /** The origin of the share server started for the tests. */
    shareServerOrigin: string;
  }
}
