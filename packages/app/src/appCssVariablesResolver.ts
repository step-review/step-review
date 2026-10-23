import type { CSSVariablesResolver } from "@mantine/core";

/** Primer's page, text and border colors, which Mantine derives otherwise. */
const appCssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    "--mantine-color-body": "#ffffff",
    "--mantine-color-text": "#1f2328",
    "--mantine-color-dimmed": "#59636e",
    "--mantine-color-default-border": "#d1d9e0",
    "--mantine-color-default-hover": "#eff2f5",
  },
  dark: {
    "--mantine-color-body": "#0d1117",
    "--mantine-color-text": "#f0f6fc",
    "--mantine-color-dimmed": "#9198a1",
    "--mantine-color-default": "#212830",
    "--mantine-color-default-border": "#3d444d",
    "--mantine-color-default-hover": "#262c36",
  },
});

export default appCssVariablesResolver;
