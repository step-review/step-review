import { UploadIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FullScreenDropzone.module.css";

interface Props {
  /** Shown over the page while a file is dragged over it. */
  label: string;
  onDrop: (file: File) => void;
}

/** Accepts a single file dropped anywhere on the page. */
export default function FullScreenDropzone({ label, onDrop }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDragLeave: () => setIsDragging(false),
    onDrop: (files) => {
      setIsDragging(false);
      const file = files[0];
      if (file) {
        onDrop(file);
      }
    },
  });
  // The overlay only catches events while shown, so the page notices the drag.
  useEffect(() => {
    const handleDragEnter = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };
    document.addEventListener("dragenter", handleDragEnter);
    return () => document.removeEventListener("dragenter", handleDragEnter);
  }, []);
  return (
    <div
      {...getRootProps({
        className: styles["overlay"],
        "aria-hidden": !isDragging,
      })}
      data-dragging={isDragging || undefined}
    >
      <input {...getInputProps()} />
      <div className={styles["label"]}>
        <UploadIcon size={48} />
        {label}
      </div>
    </div>
  );
}
