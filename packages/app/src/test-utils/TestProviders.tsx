import { BaseStyles } from "@primer/react";
import { ThemeProvider } from "@primer/react/next";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import getMessages from "../translations/getMessages.ts";

interface Props {
  children: ReactNode;
}

/** The app's providers, for component tests. */
export default function TestProviders({ children }: Props) {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={getMessages()}>
      <ThemeProvider colorMode="auto">
        <BaseStyles>{children}</BaseStyles>
      </ThemeProvider>
    </IntlProvider>
  );
}
