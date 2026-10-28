import { PencilIcon } from "@primer/octicons-react";
import { IconButton, Link, Textarea } from "@primer/react";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import startPromptPlaceholder from "../../../business-logic/prompts/startPromptPlaceholder.ts";
import usePromptTemplate from "../../../business-logic/prompts/usePromptTemplate.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import PromptTemplateDialog from "../PromptTemplateDialog/PromptTemplateDialog.tsx";
import styles from "./PromptGenerator.module.css";

interface Props {
  editable?: boolean;
}

export default function PromptGenerator({ editable = true }: Props) {
  const intl = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { promptTemplate, setPromptTemplate, defaultPromptTemplate } =
    usePromptTemplate();
  const [prompt, setPrompt] = useState(promptTemplate);
  const [isEditingPromptTemplate, setIsEditingPromptTemplate] = useState(false);
  const skillUrl = `${window.location.origin}/SKILL.md`;
  const placeholderStart = defaultPromptTemplate.indexOf(
    startPromptPlaceholder,
  );
  const skillUrlStart = defaultPromptTemplate.indexOf(skillUrl);
  const promptToCopy = editable ? prompt : defaultPromptTemplate;

  // Select the placeholder so that pasting a link replaces it.
  useEffect(() => {
    if (!editable) {
      return;
    }
    const textarea = textareaRef.current!;
    const placeholderStart = textarea.value.indexOf(startPromptPlaceholder);
    textarea.focus();
    // Custom templates can leave the placeholder out.
    if (placeholderStart === -1) {
      return;
    }
    textarea.setSelectionRange(
      placeholderStart,
      placeholderStart + startPromptPlaceholder.length,
    );
  }, [editable, promptTemplate]);

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
          // A fixed height, one line taller than the template, so that pasting
          // a link doesn't make it grow.
          rows={promptTemplate.split("\n").length + 1}
          className={styles["textarea"]}
          value={prompt}
          onChange={(event) => setPrompt(event.currentTarget.value)}
        />
      ) : (
        <p className={styles["prompt"]}>
          {defaultPromptTemplate.slice(0, placeholderStart)}
          <em>${startPromptPlaceholder}</em>
          {defaultPromptTemplate.slice(
            placeholderStart + startPromptPlaceholder.length,
            skillUrlStart,
          )}
          <Link inline href={skillUrl} target="_blank" rel="noreferrer">
            {`${window.location.host}/SKILL.md`}
          </Link>
          {defaultPromptTemplate.slice(skillUrlStart + skillUrl.length)}
        </p>
      )}
      <div className={styles["buttons"]}>
        {editable && (
          <IconButton
            variant="invisible"
            icon={PencilIcon}
            aria-label={intl.formatMessage({
              defaultMessage: "Edit the prompt template",
            })}
            onClick={() => setIsEditingPromptTemplate(true)}
          />
        )}
        <CopyIconButton
          value={promptToCopy}
          label={intl.formatMessage({ defaultMessage: "Copy the prompt" })}
          size="medium"
        />
      </div>
      {isEditingPromptTemplate && (
        <PromptTemplateDialog
          promptTemplate={promptTemplate}
          defaultPromptTemplate={defaultPromptTemplate}
          returnFocusRef={textareaRef}
          onSave={(newPromptTemplate) => {
            setPromptTemplate(newPromptTemplate);
            setPrompt(newPromptTemplate);
            setIsEditingPromptTemplate(false);
          }}
          onClose={() => setIsEditingPromptTemplate(false)}
        />
      )}
    </div>
  );
}
