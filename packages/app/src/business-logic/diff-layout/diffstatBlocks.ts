type DiffstatBlock = "added" | "deleted" | "neutral";

/** Number of blocks in a diffstat, as on GitHub. */
const blockCount = 5;

/**
 * GitHub's diffstat: five blocks, one per changed line up to five, split
 * between additions and deletions in proportion; the rest are neutral.
 */
export default function diffstatBlocks(
  additions: number,
  deletions: number,
): DiffstatBlock[] {
  const changeCount = additions + deletions;
  const filledCount = Math.min(changeCount, blockCount);
  const addedCount =
    changeCount === 0 ? 0 : Math.round((filledCount * additions) / changeCount);
  return [
    ...Array<DiffstatBlock>(addedCount).fill("added"),
    ...Array<DiffstatBlock>(filledCount - addedCount).fill("deleted"),
    ...Array<DiffstatBlock>(blockCount - filledCount).fill("neutral"),
  ];
}
