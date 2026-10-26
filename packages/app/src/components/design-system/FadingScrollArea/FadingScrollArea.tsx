import type { ReactNode } from "react";
import styles from "./FadingScrollArea.module.css";

interface Props {
  children: ReactNode;
}

/**
 * Scrolls its content vertically when its container constrains its height,
 * fading the content out at the edges it scrolls past instead of cutting it
 * off.
 */
export default function FadingScrollArea({ children }: Props) {
  return <div className={styles["area"]}>{children}</div>;
}
