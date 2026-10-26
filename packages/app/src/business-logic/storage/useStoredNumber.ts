import { useCallback, useState } from "react";
import readStorage from "./readStorage.ts";
import writeStorage from "./writeStorage.ts";

/** A number preference kept in local storage. */
export default function useStoredNumber(
  key: string,
  defaultValue: number,
): [number, (value: number) => void] {
  const [value, setValue] = useState(() => {
    const storedValue = Number(readStorage(key) ?? Number.NaN);
    return Number.isFinite(storedValue) ? storedValue : defaultValue;
  });
  const setStoredValue = useCallback(
    (newValue: number) => {
      setValue(newValue);
      writeStorage(key, String(newValue));
    },
    [key],
  );
  return [value, setStoredValue];
}
