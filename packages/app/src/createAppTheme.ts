import {
  Badge,
  DEFAULT_THEME,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";

// Built around the logo's blues: shade 6 in light mode, shade 4 in dark mode.
const brand: MantineColorsTuple = [
  "#edf3ff",
  "#dbe6ff",
  "#b5ccff",
  "#8cb2ff",
  "#74a6ff",
  "#4c88f5",
  "#2f6fe4",
  "#2259c4",
  "#1c48a0",
  "#163a80",
];

// Mantine's neutral ramps, tinted toward the logo's navy.
const dark: MantineColorsTuple = [
  "#c3c6cf",
  "#afb5c1",
  "#767d8f",
  "#5e6574",
  "#373e4d",
  "#303746",
  "#252a37",
  "#1c212c",
  "#181c26",
  "#0f1219",
];
const gray: MantineColorsTuple = [
  "#f8f9fa",
  "#f0f2f6",
  "#e8ebf0",
  "#dce0e8",
  "#ccd1dc",
  "#abb2bf",
  "#838a99",
  "#464d5a",
  "#313743",
  "#1e232c",
];

export default function createAppTheme() {
  return createTheme({
    primaryColor: "brand",
    primaryShade: { light: 6, dark: 4 },
    autoContrast: true,
    // The logo's navy, also the contrast color on the dark-mode primary.
    black: "#0f1d3a",
    colors: {
      brand,
      dark,
      gray,
      // Semantic colors, each with a single meaning across the app. The brand
      // color marks what is interactive, current, or the reviewer's own, and
      // gray what is neutral.
      addition: DEFAULT_THEME.colors.green,
      removal: DEFAULT_THEME.colors.red,
      danger: DEFAULT_THEME.colors.red,
      success: DEFAULT_THEME.colors.teal,
      attention: DEFAULT_THEME.colors.orange,
      question: DEFAULT_THEME.colors.violet,
      revision: DEFAULT_THEME.colors.cyan,
      warning: DEFAULT_THEME.colors.yellow,
    },
    fontFamilyMonospace:
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    headings: {
      fontWeight: "600",
      sizes: {
        h1: { fontSize: "1.875rem", lineHeight: "1.25" },
        h2: { fontSize: "1.5rem", lineHeight: "1.3" },
        h3: { fontSize: "1.25rem", lineHeight: "1.35" },
        h4: { fontSize: "1.0625rem", lineHeight: "1.4" },
      },
    },
    defaultRadius: "sm",
    components: {
      Badge: Badge.extend({ defaultProps: { radius: "sm" } }),
    },
  });
}
