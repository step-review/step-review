import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

interface Props {
  children: ReactNode;
}

/** The app's providers, for component tests. */
export default function TestProviders({ children }: Props) {
  return (
    <IntlProvider locale="en" defaultLocale="en">
      <MantineProvider env="test">{children}</MantineProvider>
    </IntlProvider>
  );
}
