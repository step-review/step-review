import useLocationParts from "./useLocationParts.ts";

/** The ID of the element the URL scrolls to, if any. */
export default function useFragment(): string {
  return useLocationParts().fragment;
}
