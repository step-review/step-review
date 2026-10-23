import type { Ref } from "react";

interface Props {
  /** Call `click()` on it to open the file picker. */
  ref: Ref<HTMLInputElement>;
  accept?: string;
  onChange: (file: File) => void;
}

/** A file input without UI, for buttons and menu items that pick a file. */
export default function HiddenFileInput({ ref, accept, onChange }: Props) {
  return (
    <input
      ref={ref}
      type="file"
      hidden
      accept={accept}
      onChange={(event) => {
        const file = event.currentTarget.files?.[0];
        // Lets the user choose the same file again, e.g. after fixing it.
        event.currentTarget.value = "";
        if (file) {
          onChange(file);
        }
      }}
    />
  );
}
