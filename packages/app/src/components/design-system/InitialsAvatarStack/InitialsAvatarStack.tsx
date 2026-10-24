import { useRef, useState } from "react";
import AnchoredTooltip from "../AnchoredTooltip/AnchoredTooltip.tsx";
import InitialsAvatar from "../InitialsAvatar/InitialsAvatar.tsx";
import styles from "./InitialsAvatarStack.module.css";

interface Props {
  people: { key: string; name: string; label: string; colorIndex: number }[];
  /** The accessible name and tooltip of the whole stack, e.g. who they are. */
  label: string;
  /** Beyond it, the rest are counted. */
  maxVisibleCount?: number;
}

/** Small overlapping avatars, e.g. the people on a step. */
export default function InitialsAvatarStack({
  people,
  label,
  maxVisibleCount = 3,
}: Props) {
  const stackRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  if (people.length === 0) {
    return null;
  }
  const visiblePeople = people.slice(0, maxVisibleCount);
  const hiddenCount = people.length - visiblePeople.length;
  return (
    <>
      <span
        ref={stackRef}
        role="img"
        aria-label={label}
        className={styles["stack"]}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        {visiblePeople.map((person) => (
          <span key={person.key} className={styles["item"]}>
            <InitialsAvatar
              name={person.name}
              label={person.label}
              colorIndex={person.colorIndex}
              size="small"
            />
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className={styles["hiddenCount"]}>+{hiddenCount}</span>
        )}
      </span>
      <AnchoredTooltip
        anchorRef={stackRef}
        isOpen={isTooltipOpen}
        text={label}
      />
    </>
  );
}
