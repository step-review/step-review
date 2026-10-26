import type { FileDiffStatus } from "@step-review/review-format";
import type { IntlShape } from "react-intl";

/** The name of a file's status, shared by its badge and its icon's label. */
export default function formatFileStatus(
  intl: IntlShape,
  status: FileDiffStatus,
): string {
  switch (status) {
    case "added":
      return intl.formatMessage({ defaultMessage: "Added" });
    case "deleted":
      return intl.formatMessage({ defaultMessage: "Deleted" });
    case "renamed":
      return intl.formatMessage({ defaultMessage: "Renamed" });
    case "copied":
      return intl.formatMessage({ defaultMessage: "Copied" });
    case "modified":
      return intl.formatMessage({ defaultMessage: "Modified" });
  }
}
