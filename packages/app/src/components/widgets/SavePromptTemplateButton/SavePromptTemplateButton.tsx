import { BookmarkIcon, CheckIcon } from "@primer/octicons-react";
import { IconButton } from "@primer/react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import startPromptPlaceholder from "../../../business-logic/prompts/startPromptPlaceholder.ts";
import styles from "./SavePromptTemplateButton.module.css";

interface Props {
  prompt: string;
  onSave: (promptTemplate: string) => void;
}

/** How long the button shows that the template was saved, in milliseconds. */
const savedDuration = 1500;

/** Saves the prompt as the template that later prompts start from. */
export default function SavePromptTemplateButton({ prompt, onSave }: Props) {
  const intl = useIntl();
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (!isSaved) {
      return;
    }
    const timeout = setTimeout(() => setIsSaved(false), savedDuration);
    return () => clearTimeout(timeout);
  }, [isSaved]);
  const canSave = prompt.includes(startPromptPlaceholder);
  return (
    <IconButton
      variant="invisible"
      icon={isSaved ? CheckIcon : BookmarkIcon}
      className={styles["button"]}
      data-saved={isSaved || undefined}
      // Inactive rather than disabled, so that its tooltip still says why.
      inactive={!canSave}
      aria-disabled={!canSave || undefined}
      aria-label={
        isSaved
          ? intl.formatMessage({ defaultMessage: "Saved as template" })
          : intl.formatMessage({ defaultMessage: "Save as template" })
      }
      description={
        canSave
          ? undefined
          : intl.formatMessage(
              {
                defaultMessage: "The template needs to contain {placeholder}",
              },
              { placeholder: startPromptPlaceholder },
            )
      }
      onClick={() => {
        if (!canSave) {
          return;
        }
        onSave(prompt);
        setIsSaved(true);
      }}
    />
  );
}
