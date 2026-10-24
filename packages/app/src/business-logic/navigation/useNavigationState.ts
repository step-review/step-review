import useLocationParts from "./useLocationParts.ts";

export default function useNavigationState() {
  return useLocationParts().route;
}
