import { Group, Text } from "@mantine/core";
import styles from "./Diffstat.module.css";

interface Props {
  additions: number;
  deletions: number;
  blocks: ("added" | "deleted" | "neutral")[];
}

/** Added and deleted line counts, with GitHub's diffstat blocks. */
export default function Diffstat({ additions, deletions, blocks }: Props) {
  return (
    <Group gap={6} wrap="nowrap">
      <Text size="xs" fw={600} className={styles["additions"]}>
        +{additions}
      </Text>
      <Text size="xs" fw={600} className={styles["deletions"]}>
        −{deletions}
      </Text>
      <span className={styles["blocks"]} aria-hidden>
        {blocks.map((block, index) => (
          <span key={index} className={styles["block"]} data-block={block} />
        ))}
      </span>
    </Group>
  );
}
