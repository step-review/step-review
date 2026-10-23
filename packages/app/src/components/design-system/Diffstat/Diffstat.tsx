import styles from "./Diffstat.module.css";

interface Props {
  additions: number;
  deletions: number;
  blocks: ("added" | "deleted" | "neutral")[];
}

/** Added and deleted line counts, with GitHub's diffstat blocks. */
export default function Diffstat({ additions, deletions, blocks }: Props) {
  return (
    <span className={styles["diffstat"]}>
      <span className={styles["additions"]}>+{additions}</span>
      <span className={styles["deletions"]}>−{deletions}</span>
      <span className={styles["blocks"]} aria-hidden>
        {blocks.map((block, index) => (
          <span key={index} className={styles["block"]} data-block={block} />
        ))}
      </span>
    </span>
  );
}
