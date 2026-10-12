import { Button } from "@mantine/core";
import { FormattedMessage } from "react-intl";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";

interface Props {
  hiddenLineCount: number;
  colSpan: number;
  onExpand: () => void;
}

export default function GapRow({ hiddenLineCount, colSpan, onExpand }: Props) {
  return (
    <DiffTableRow>
      <DiffTableCell kind="full" tone="gap" colSpan={colSpan}>
        <Button size="compact-xs" variant="subtle" onClick={onExpand}>
          <FormattedMessage
            defaultMessage="Show {hiddenLineCount} hidden lines"
            values={{ hiddenLineCount }}
          />
        </Button>
      </DiffTableCell>
    </DiffTableRow>
  );
}
