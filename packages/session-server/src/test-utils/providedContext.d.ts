import "vitest";

declare module "vitest" {
  export interface ProvidedContext {
    sessionServerOrigin: string;
  }
}
