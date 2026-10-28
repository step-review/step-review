import { Dialog, FormControl, Textarea } from "@primer/react";
import { useState, type RefObject } from "react";
import { useIntl } from "react-intl";
import startPromptPlaceholder from "../../../business-logic/prompts/startPromptPlaceholder.ts";
import styles from "./PromptTemplateDialog.module.css";

interface Props {
  promptTemplate: string;
  defaultPromptTemplate: string;
  onSave: (promptTemplate: string) => void;
  /** Closed without saving. */
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

/** Edits the prompt the user starts from. */
export default function PromptTemplateDialog({
  promptTemplate,
  defaultPromptTemplate,
  onSave,
  onClose,
  returnFocusRef,
}: Props) {
  const intl = useIntl();
  const [draftPromptTemplate, setDraftPromptTemplate] =
    useState(promptTemplate);
  return (
    <Dialog
      title={intl.formatMessage({ defaultMessage: "Edit prompt template" })}
      subtitle={intl.formatMessage(
        {
          defaultMessage:
            "Write {placeholder} where the PR link goes. The template is saved in this browser.",
        },
        { placeholder: startPromptPlaceholder },
      )}
      width="large"
      returnFocusRef={returnFocusRef}
      onClose={onClose}
      footerButtons={[
        {
          buttonType: "default",
          content: intl.formatMessage({ defaultMessage: "Restore default" }),
          disabled: draftPromptTemplate === defaultPromptTemplate,
          onClick: () => setDraftPromptTemplate(defaultPromptTemplate),
        },
        {
          buttonType: "default",
          content: intl.formatMessage({ defaultMessage: "Cancel" }),
          onClick: onClose,
        },
        {
          buttonType: "primary",
          content: intl.formatMessage({ defaultMessage: "Save" }),
          onClick: () => onSave(draftPromptTemplate),
        },
      ]}
    >
      <FormControl>
        <FormControl.Label>
          {intl.formatMessage({ defaultMessage: "Prompt template" })}
        </FormControl.Label>
        <Textarea
          block
          autoFocus
          rows={8}
          resize="vertical"
          className={styles["textarea"]}
          value={draftPromptTemplate}
          onChange={(event) =>
            setDraftPromptTemplate(event.currentTarget.value)
          }
        />
      </FormControl>
    </Dialog>
  );
}
