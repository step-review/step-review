import { FormattedMessage } from "react-intl";
import Floor0Logo from "../../design-system/Floor0Logo/Floor0Logo.tsx";
import styles from "./ProjectCredits.module.css";

interface Props {
  align?: "start" | "center";
  /** `inline` puts the caption and a smaller wordmark on one line. */
  layout?: "stacked" | "inline";
}

/** Who makes Step Review: a caption, then floor 0's wordmark. */
export default function ProjectCredits({
  align = "start",
  layout = "stacked",
}: Props) {
  return (
    <div className={styles["credits"]} data-align={align} data-layout={layout}>
      <span className={styles["caption"]}>
        <FormattedMessage defaultMessage="by" />
      </span>
      <span className={styles["logo"]}>
        <Floor0Logo />
      </span>
    </div>
  );
}
