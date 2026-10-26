import { CheckIcon, CopyIcon } from "@primer/octicons-react";
import { IconButton } from "@primer/react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styles from "./CopyIconButton.module.css";

interface Props {
  value: string;
  label: string;
  size?: "small" | "medium";
  /** Shows the value as copied from the start, e.g. copied on its own. */
  isInitiallyCopied?: boolean;
}

/** How long the button shows that the value was copied, in milliseconds. */
const copiedDuration = 1500;

export default function CopyIconButton({
  value,
  label,
  size = "small",
  isInitiallyCopied = false,
}: Props) {
  const intl = useIntl();
  const [isCopied, setIsCopied] = useState(isInitiallyCopied);
  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timeout = setTimeout(() => setIsCopied(false), copiedDuration);
    return () => clearTimeout(timeout);
  }, [isCopied]);
  return (
    <IconButton
      variant="invisible"
      size={size}
      icon={isCopied ? CheckIcon : CopyIcon}
      className={styles["button"]}
      data-copied={isCopied || undefined}
      aria-label={
        isCopied ? intl.formatMessage({ defaultMessage: "Copied" }) : label
      }
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => setIsCopied(true));
      }}
    />
  );
}
