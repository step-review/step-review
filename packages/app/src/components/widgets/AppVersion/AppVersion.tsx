import { Link } from "@primer/react";
import styles from "./AppVersion.module.css";

/** The app's version, linking to its release when it is one. */
export default function AppVersion() {
  const label = `v${__APP_VERSION__}`;
  if (!/^\d+\.\d+\.\d+$/u.test(__APP_VERSION__)) {
    return <span className={styles["version"]}>{label}</span>;
  }
  return (
    <Link
      className={styles["version"]}
      href={`https://github.com/step-review/step-review/tree/${label}`}
      target="_blank"
      rel="noreferrer"
      muted
    >
      {label}
    </Link>
  );
}
