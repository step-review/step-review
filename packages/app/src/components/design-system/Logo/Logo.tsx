import styles from "./Logo.module.css";

interface Props {
  size: number;
}

/** The Step Review logo, following the app's color scheme. */
export default function Logo({ size }: Props) {
  return (
    <svg
      className={styles["logo"]}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="Step Review"
    >
      <rect className={styles["background"]} width="64" height="64" rx="14" />
      <g className={styles["bars"]}>
        <rect x="12" y="17" width="25" height="7" rx="1.5" />
        <rect x="12" y="28.5" width="25" height="7" rx="1.5" />
        <rect x="12" y="40" width="25" height="7" rx="1.5" />
      </g>
      <g
        className={styles["marks"]}
        fill="none"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M42.5 20.5 46 24 52.5 17" />
        <path d="M42.5 32 46 35.5 52.5 28.5" />
        <path d="M43.5 40.5 50.5 47.5 M50.5 40.5 43.5 47.5" />
      </g>
    </svg>
  );
}
