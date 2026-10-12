import { Group, Text, Textarea } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import createStartPrompt from "../../../business-logic/prompts/createStartPrompt.ts";
import startPromptPlaceholder from "../../../business-logic/prompts/startPromptPlaceholder.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import styles from "./PromptGenerator.module.css";

export default function PromptGenerator() {
  const intl = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isPastingRef = useRef(false);
  const [prompt, setPrompt] = useState(() =>
    createStartPrompt(window.location.origin),
  );
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Select the placeholder so that pasting a link replaces it.
  useEffect(() => {
    const textarea = textareaRef.current!;
    const placeholderStart = textarea.value.indexOf(startPromptPlaceholder);
    textarea.focus();
    textarea.setSelectionRange(
      placeholderStart,
      placeholderStart + startPromptPlaceholder.length,
    );
  }, []);

  return (
    <div className={styles["root"]}>
      <Textarea
        ref={textareaRef}
        aria-label={intl.formatMessage({
          defaultMessage: "Prompt for your coding agent",
        })}
        size="lg"
        resize="none"
        rightSection={
          <CopyIconButton
            value={prompt}
            label={intl.formatMessage({ defaultMessage: "Copy the prompt" })}
            size="lg"
            variant="default"
          />
        }
        rightSectionWidth={60}
        classNames={{
          input: styles["input"],
          section: styles["copyButtonSection"],
        }}
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
      {copiedPrompt === prompt && (
        <Group gap={6} c="teal" className={styles["copiedMessage"]}>
          <IconCheck size={16} />
          <Text size="sm">
            <FormattedMessage defaultMessage="Prompt copied" />
          </Text>
        </Group>
      )}
    </div>
  );
}
