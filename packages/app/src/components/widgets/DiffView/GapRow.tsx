import { ActionIcon, Anchor } from "@mantine/core";
import { IconArrowsMoveVertical } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";

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
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={onExpand}
          aria-label={intl.formatMessage({ defaultMessage: "Expand" })}
        >
          <IconArrowsMoveVertical size={14} />
        </ActionIcon>
      </DiffTableCell>
      <DiffTableCell kind="code" tone="gap" colSpan={codeColSpan}>
        <Anchor component="button" c="dimmed" fz="inherit" onClick={onExpand}>
          <FormattedMessage
            defaultMessage="{hiddenLineCount, plural, one {# hidden line} other {# hidden lines}}"
            values={{ hiddenLineCount }}
          />
        </Anchor>
      </DiffTableCell>
    </DiffTableRow>
  );
}
