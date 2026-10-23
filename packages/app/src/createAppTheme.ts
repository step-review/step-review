import {
  Badge,
  DEFAULT_THEME,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";

// The colors, type and shapes follow GitHub's Primer design system, so the
// review reads like a GitHub pull request.

// Primer's blue: shade 5 is the light-mode accent, shade 4 the dark-mode one.
const brand: MantineColorsTuple = [
  "#ddf4ff",
  "#b6e3ff",
  "#80ccff",
  "#54aeff",
  "#218bff",
  "#0969da",
  "#0550ae",
  "#033d8b",
  "#0a3069",
  "#002155",
];

// Primer's dark neutrals, in Mantine's slots: text (0), dimmed text (2),
// borders (4), hovered surfaces (5), raised surfaces (6), the page (7).
const dark: MantineColorsTuple = [
  "#f0f6fc",
  "#d1d7e0",
  "#9198a1",
  "#656c76",
  "#3d444d",
  "#262c36",
  "#151b23",
  "#0d1117",
  "#010409",
  "#010409",
];

// Primer's light neutrals, in Mantine's slots: muted surfaces (0), borders
// (3, 4), dimmed text (6).
const gray: MantineColorsTuple = [
  "#f6f8fa",
  "#eff2f5",
  "#e6eaef",
  "#d1d9e0",
  "#d1d9e0",
  "#818b98",
  "#59636e",
  "#454c54",
  "#393f46",
  "#25292e",
];

export default function createAppTheme() {
  return createTheme({
    primaryColor: "brand",
    primaryShade: { light: 5, dark: 4 },
    autoContrast: true,
    black: "#1f2328",
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
      success: DEFAULT_THEME.colors.green,
      attention: DEFAULT_THEME.colors.orange,
      question: DEFAULT_THEME.colors.violet,
      revision: DEFAULT_THEME.colors.cyan,
      warning: DEFAULT_THEME.colors.yellow,
    },
    fontFamily:
      '"Mona Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    fontFamilyMonospace:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    fontSizes: {
      xs: "0.75rem",
      sm: "0.8125rem",
      md: "0.875rem",
      lg: "1rem",
      xl: "1.25rem",
    },
    lineHeights: { md: "1.5" },
    headings: {
      fontFamily:
        '"Mona Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      fontWeight: "600",
      sizes: {
        h1: { fontSize: "2rem", lineHeight: "1.25" },
        h2: { fontSize: "1.5rem", lineHeight: "1.25" },
        h3: { fontSize: "1.25rem", lineHeight: "1.25" },
        h4: { fontSize: "1rem", lineHeight: "1.5" },
      },
    },
    radius: {
      xs: "0.1875rem",
      sm: "0.375rem",
      md: "0.375rem",
      lg: "0.75rem",
      xl: "0.75rem",
    },
    defaultRadius: "sm",
    components: {
      Badge: Badge.extend({ defaultProps: { radius: "xl" } }),
    },
  });
}
