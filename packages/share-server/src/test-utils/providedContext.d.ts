import "vitest";

declare module "vitest" {
  export interface ProvidedContext {
    shareServerOrigin: string;
  }
}
