import { useEffect, useState } from "react";
import importSessionKey from "./importSessionKey.ts";

/**
 * The imported key of a session. `null` when the text isn't a key, `undefined`
 * while it is imported.
 */
export default function useImportedSessionKey(
  sessionKey: string,
): CryptoKey | null | undefined {
  const [importedSessionKey, setImportedSessionKey] = useState<{
    sessionKey: string;
    cryptoKey: CryptoKey | null;
  }>();
  useEffect(() => {
    let isCurrent = true;
    void importSessionKey(sessionKey).then((cryptoKey) => {
      if (isCurrent) {
        setImportedSessionKey({ sessionKey, cryptoKey });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [sessionKey]);
  return importedSessionKey?.sessionKey === sessionKey
    ? importedSessionKey.cryptoKey
    : undefined;
}
