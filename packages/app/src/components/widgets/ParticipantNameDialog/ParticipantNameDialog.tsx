import { Dialog, FormControl, TextInput } from "@primer/react";
import { useState } from "react";
import { useIntl } from "react-intl";
import participantNameMaxLength from "../../../business-logic/participant-state/participantNameMaxLength.ts";

interface Props {
  title: string;
  description: string;
  submitLabel: string;
  initialName: string;
  onSubmit: (name: string) => void;
  /** Closed without submitting. */
  onClose: () => void;
}

/** Asks for the name the other participants of a shared review see. */
export default function ParticipantNameDialog({
  title,
  description,
  submitLabel,
  initialName,
  onSubmit,
  onClose,
}: Props) {
  const intl = useIntl();
  const [name, setName] = useState(initialName);
  const submit = () => onSubmit(name.trim());
  return (
    <Dialog
      title={title}
      subtitle={description}
      onClose={onClose}
      footerButtons={[
        {
          buttonType: "default",
          content: intl.formatMessage({ defaultMessage: "Cancel" }),
          onClick: onClose,
        },
        { buttonType: "primary", content: submitLabel, onClick: submit },
      ]}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <FormControl>
          <FormControl.Label>
            {intl.formatMessage({ defaultMessage: "Your name" })}
          </FormControl.Label>
          <TextInput
            block
            autoFocus
            value={name}
            maxLength={participantNameMaxLength}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </FormControl>
      </form>
    </Dialog>
  );
}
