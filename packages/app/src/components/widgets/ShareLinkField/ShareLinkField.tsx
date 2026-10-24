import { FormControl, TextInput } from "@primer/react";
import { useId } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import styles from "./ShareLinkField.module.css";

interface Props {
  link: string;
}

/** A shared review's link, to copy. */
export default function ShareLinkField({ link }: Props) {
  const intl = useIntl();
  // FormControl only labels its direct children: the input is in a row with
  // the copy button.
  const inputId = useId();
  return (
    <FormControl id={inputId}>
      <FormControl.Label>
        <FormattedMessage defaultMessage="Link" />
      </FormControl.Label>
      <div className={styles["field"]}>
        <div className={styles["input"]}>
          <TextInput
            id={inputId}
            block
            readOnly
            monospace
            value={link}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
        <CopyIconButton
          value={link}
          size="medium"
          label={intl.formatMessage({ defaultMessage: "Copy the link" })}
        />
      </div>
      <FormControl.Caption>
        <FormattedMessage defaultMessage="Anyone with the link can open the review and join it. The key that decrypts it is in the link only." />
      </FormControl.Caption>
    </FormControl>
  );
}
