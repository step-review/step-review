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
  const [fileFilter, setFileFilter] = useStoredPreference(
    "step-review:file-filter",
    ["all", "changed"],
    "all",
  );
  return {
    layout,
    setLayout,
    explainers,
    setExplainers,
    fileFilter,
    setFileFilter,
  };
}
