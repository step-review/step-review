import { Link, Textarea } from "@primer/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import startPromptPlaceholder from "../../../business-logic/prompts/startPromptPlaceholder.ts";
import usePromptTemplate from "../../../business-logic/prompts/usePromptTemplate.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import SavePromptTemplateButton from "../SavePromptTemplateButton/SavePromptTemplateButton.tsx";
import countTextareaLines from "./countTextareaLines.ts";
import styles from "./PromptGenerator.module.css";

interface Props {
  editable?: boolean;
}

/** How long saving shows that the template was saved, in milliseconds. */
const savedDuration = 1500;

export default function PromptGenerator({ editable = true }: Props) {
  const intl = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { promptTemplate, setPromptTemplate, defaultPromptTemplate } =
    usePromptTemplate();
  const [prompt, setPrompt] = useState(promptTemplate);
  const [textareaRows, setTextareaRows] = useState(1);
  const [isPromptTemplateSaved, setIsPromptTemplateSaved] = useState(false);
  const skillUrl = `${window.location.origin}/SKILL.md`;
  const placeholderStart = defaultPromptTemplate.indexOf(
    startPromptPlaceholder,
  );
  const skillUrlStart = defaultPromptTemplate.indexOf(skillUrl);
  // Until a PR link replaces the placeholder, the prompt is a template.
  const isPromptTemplate = prompt.includes(startPromptPlaceholder);

  // Grow with the prompt as it is written.
  useLayoutEffect(() => {
    if (!editable) {
      return;
    }
    setTextareaRows(countTextareaLines(textareaRef.current!));
  }, [editable, prompt]);

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
  }, [editable, promptTemplate]);

  useEffect(() => {
    if (!isPromptTemplateSaved) {
      return;
    }
    const timeout = setTimeout(
      () => setIsPromptTemplateSaved(false),
      savedDuration,
    );
    return () => clearTimeout(timeout);
  }, [isPromptTemplateSaved]);

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
          rows={textareaRows}
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
      <div className={styles["button"]}>
        {editable && isPromptTemplate ? (
          <SavePromptTemplateButton
            isSaved={isPromptTemplateSaved}
            onSave={() => {
              setPromptTemplate(prompt);
              setIsPromptTemplateSaved(true);
            }}
          />
        ) : (
          <CopyIconButton
            value={editable ? prompt : defaultPromptTemplate}
            label={intl.formatMessage({ defaultMessage: "Copy the prompt" })}
            size="medium"
          />
        )}
      </div>
    </div>
  );
}
