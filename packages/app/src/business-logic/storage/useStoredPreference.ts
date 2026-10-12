import { useCallback, useState } from "react";
import readStorage from "./readStorage.ts";
import writeStorage from "./writeStorage.ts";

/** A string preference kept in local storage, limited to known values. */
export default function useStoredPreference<Value extends string>(
  key: string,
  values: Value[],
  defaultValue: Value,
): [Value, (value: Value) => void] {
  const [value, setValue] = useState<Value>(() => {
    const storedValue = readStorage(key);
    return (
      values.find((knownValue) => knownValue === storedValue) ?? defaultValue
    );
  });
  const setStoredValue = useCallback(
    (newValue: Value) => {
      setValue(newValue);
      writeStorage(key, newValue);
    },
    [key],
  );
  return [value, setStoredValue];
}
