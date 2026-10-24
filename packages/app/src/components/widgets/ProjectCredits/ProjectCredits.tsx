import { FormattedMessage } from "react-intl";
import Floor0Logo from "../../design-system/Floor0Logo/Floor0Logo.tsx";
import styles from "./ProjectCredits.module.css";

interface Props {
  size?: "small" | "large";
}

/** Who makes Step Review: a caption, then floor 0's wordmark, on one line. */
export default function ProjectCredits({ size = "small" }: Props) {
  return (
    <div className={styles["credits"]} data-size={size}>
      <span className={styles["caption"]}>
        <FormattedMessage defaultMessage="by" />
      </span>
      <span className={styles["logo"]}>
        <Floor0Logo />
      </span>
    </div>
  );
}
