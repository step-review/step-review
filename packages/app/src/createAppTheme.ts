import { createTheme } from "@mantine/core";

export default function createAppTheme() {
  return createTheme({
    primaryColor: "blue",
    fontFamilyMonospace:
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    defaultRadius: "md",
  });
}
