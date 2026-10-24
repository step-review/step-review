import useStoredPreference from "../storage/useStoredPreference.ts";

/** How the reviewer likes diffs shown, remembered across reviews. */
export default function useDiffPreferences() {
  const [layout, setLayout] = useStoredPreference(
    "step-review:diff-layout",
    ["unified", "split"],
    "unified",
  );
  const [explainers, setExplainers] = useStoredPreference(
    "step-review:explainers",
    ["shown", "hidden"],
    "shown",
  );
  return { layout, setLayout, explainers, setExplainers };
}
