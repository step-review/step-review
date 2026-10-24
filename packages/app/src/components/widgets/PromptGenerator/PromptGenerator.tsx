import { CheckIcon } from "@primer/octicons-react";
import { Link, Textarea } from "@primer/react";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import createStartPrompt from "../../../business-logic/prompts/createStartPrompt.ts";
import startPromptPlaceholder from "../../../business-logic/prompts/startPromptPlaceholder.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import styles from "./PromptGenerator.module.css";

interface Props {
  editable?: boolean;
}

export default function PromptGenerator({ editable = true }: Props) {
  const intl = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isPastingRef = useRef(false);
  const defaultPrompt = createStartPrompt(window.location.origin);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const skillUrl = `${window.location.origin}/SKILL.md`;
  const placeholderStart = defaultPrompt.indexOf(startPromptPlaceholder);
  const skillUrlStart = defaultPrompt.indexOf(skillUrl);
  const promptToCopy = editable ? prompt : defaultPrompt;

  // Select the placeholder so that pasting a link replaces it.
  useEffect(() => {
    if (!editable) {
      return;
    }
    const textarea = textareaRef.current!;
    const placeholderStart = textarea.value.indexOf(startPromptPlaceholder);
    textarea.focus();
    textarea.setSelectionRange(
      placeholderStart,
      placeholderStart + startPromptPlaceholder.length,
    );
  }, [editable]);

  return (
    <div className={styles["root"]}>
      {editable ? (
        <Textarea
          ref={textareaRef}
          aria-label={intl.formatMessage({
            defaultMessage: "Prompt for your coding agent",
          })}
          block
          resize="none"
          autoSize
          className={styles["textarea"]}
          value={prompt}
          onPaste={() => {
            isPastingRef.current = true;
          }}
          onChange={(event) => {
            const updatedPrompt = event.currentTarget.value;
            setPrompt(updatedPrompt);
            // Pasting completes the prompt, so copy it for the coding agent.
            if (isPastingRef.current) {
              isPastingRef.current = false;
              void navigator.clipboard
                .writeText(updatedPrompt)
                .then(() => setCopiedPrompt(updatedPrompt));
            }
          }}
        />
      ) : (
        <p className={styles["prompt"]}>
          {defaultPrompt.slice(0, placeholderStart)}
          <em>${startPromptPlaceholder}</em>
          {defaultPrompt.slice(
            placeholderStart + startPromptPlaceholder.length,
            skillUrlStart,
          )}
          <Link inline href={skillUrl} target="_blank" rel="noreferrer">
            {`${window.location.host}/SKILL.md`}
          </Link>
          {defaultPrompt.slice(skillUrlStart + skillUrl.length)}
        </p>
      )}
      <div className={styles["copyButton"]}>
        <CopyIconButton
          value={promptToCopy}
          label={intl.formatMessage({ defaultMessage: "Copy the prompt" })}
          size="medium"
        />
      </div>
      {editable && copiedPrompt === prompt && (
        <div className={styles["copiedMessage"]}>
          <CheckIcon size={16} />
          <FormattedMessage defaultMessage="Prompt copied" />
        </div>
      )}
    </div>
  );
}
