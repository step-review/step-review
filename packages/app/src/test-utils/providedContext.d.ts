import "vitest";

declare module "vitest" {
  export interface ProvidedContext {
    /** The origin of the session server started for the tests. */
    sessionServerOrigin: string;
  }
}
