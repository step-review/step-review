import styles from "./ScreenshotFrame.module.css";

interface Props {
  lightSrc: string;
  darkSrc: string;
  alt: string;
}

/** A bordered screenshot, showing the variant matching the system color scheme. */
export default function ScreenshotFrame({ lightSrc, darkSrc, alt }: Props) {
  return (
    <picture className={styles["frame"]}>
      <source srcSet={darkSrc} media="(prefers-color-scheme: dark)" />
      <img className={styles["image"]} src={lightSrc} alt={alt} />
    </picture>
  );
}
