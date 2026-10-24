import { useEffect, useState } from "react";
import importShareKey from "./importShareKey.ts";

/**
 * The imported key of a share. `null` when the text isn't a key, `undefined`
 * while it is imported.
 */
export default function useImportedShareKey(
  shareKey: string,
): CryptoKey | null | undefined {
  const [importedShareKey, setImportedShareKey] = useState<{
    shareKey: string;
    cryptoKey: CryptoKey | null;
  }>();
  useEffect(() => {
    let isCurrent = true;
    void importShareKey(shareKey).then((cryptoKey) => {
      if (isCurrent) {
        setImportedShareKey({ shareKey, cryptoKey });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [shareKey]);
  return importedShareKey?.shareKey === shareKey
    ? importedShareKey.cryptoKey
    : undefined;
}
