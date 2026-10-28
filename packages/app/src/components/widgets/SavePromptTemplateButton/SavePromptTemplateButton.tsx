import { BookmarkIcon, CheckIcon } from "@primer/octicons-react";
import { IconButton } from "@primer/react";
import { useIntl } from "react-intl";
import styles from "./SavePromptTemplateButton.module.css";

interface Props {
  /** Shows that the template was just saved. */
  isSaved: boolean;
  onSave: () => void;
}

/** Saves the prompt as the template that later prompts start from. */
export default function SavePromptTemplateButton({ isSaved, onSave }: Props) {
  const intl = useIntl();
  return (
    <IconButton
      variant="invisible"
      size="small"
      icon={isSaved ? CheckIcon : BookmarkIcon}
      className={styles["button"]}
      data-saved={isSaved || undefined}
      aria-label={
        isSaved
          ? intl.formatMessage({ defaultMessage: "Saved as template" })
          : intl.formatMessage({ defaultMessage: "Save as template" })
      }
      onClick={onSave}
    />
  );
}
