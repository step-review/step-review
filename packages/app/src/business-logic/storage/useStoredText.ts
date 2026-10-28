import { useCallback, useState } from "react";
import readStorage from "./readStorage.ts";
import removeStorage from "./removeStorage.ts";
import writeStorage from "./writeStorage.ts";

/**
 * A text kept in local storage. Setting it back to the default forgets it, so
 * that later changes to the default apply.
 */
export default function useStoredText(
  key: string,
  defaultValue: string,
): [string, (value: string) => void] {
  const [value, setValue] = useState(() => readStorage(key) ?? defaultValue);
  const setStoredValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (newValue === defaultValue) {
        removeStorage(key);
      } else {
        writeStorage(key, newValue);
      }
    },
    [key, defaultValue],
  );
  return [value, setStoredValue];
}
