import styles from "./Floor0Logo.module.css";

/** Floor 0's wordmark, as on floor0.dev, linking to its site. */
export default function Floor0Logo() {
  return (
    <a
      className={styles["logo"]}
      href="https://floor0.dev"
      target="_blank"
      rel="noreferrer"
    >
      floor 0
    </a>
  );
}
