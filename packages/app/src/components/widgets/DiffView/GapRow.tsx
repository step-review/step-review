import { UnfoldIcon } from "@primer/octicons-react";
import { IconButton, Link } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";
import styles from "./GapRow.module.css";

interface Props {
  hiddenLineCount: number;
  /** Columns before the code: the line numbers. */
  numberColSpan: number;
  codeColSpan: number;
  onExpand: () => void;
}

export default function GapRow({
  hiddenLineCount,
  numberColSpan,
  codeColSpan,
  onExpand,
}: Props) {
  const intl = useIntl();
  return (
    <DiffTableRow>
      <DiffTableCell kind="number" tone="gap" colSpan={numberColSpan}>
        <IconButton
          variant="invisible"
          size="small"
          icon={UnfoldIcon}
          onClick={onExpand}
          aria-label={intl.formatMessage({ defaultMessage: "Expand" })}
        />
      </DiffTableCell>
      <DiffTableCell kind="code" tone="gap" colSpan={codeColSpan}>
        <Link
          as="button"
          muted
          className={styles["expandLink"]}
          onClick={onExpand}
        >
          <FormattedMessage
            defaultMessage="{hiddenLineCount, plural, one {# hidden line} other {# hidden lines}}"
            values={{ hiddenLineCount }}
          />
        </Link>
      </DiffTableCell>
    </DiffTableRow>
  );
}
