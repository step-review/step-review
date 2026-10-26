import styles from "./InitialsAvatar.module.css";

interface Props {
  /** The person's name, shown as its initials; `?` when empty. */
  name: string;
  /** The accessible name, e.g. the name with a status. */
  label: string;
  /** One of the 12 data visualization colors. */
  colorIndex: number;
  size?: "small" | "medium";
  /** E.g. for a person who isn't online. */
  isDimmed?: boolean;
}

/** An avatar for people without a picture: their initials on a color. */
export default function InitialsAvatar({
  name,
  label,
  colorIndex,
  size = "medium",
  isDimmed = false,
}: Props) {
  const initials =
    name
      .split(/\s+/u)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => firstCharacter(word).toLocaleUpperCase())
      .join("") || "?";
  return (
    <span
      role="img"
      aria-label={label}
      className={styles["avatar"]}
      data-size={size}
      data-color={colorIndex}
      data-dimmed={isDimmed || undefined}
    >
      {initials}
    </span>
  );
}

/** The first user-perceived character, e.g. a whole emoji. */
function firstCharacter(word: string): string {
  const [firstSegment] = new Intl.Segmenter().segment(word);
  return firstSegment?.segment ?? "";
}
