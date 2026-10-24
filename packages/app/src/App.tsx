import { BaseStyles } from "@primer/react";
import { ThemeProvider } from "@primer/react/next";
import { IntlProvider } from "react-intl";
import LoadedReviewStateProvider from "./business-logic/review-state/LoadedReviewStateProvider.tsx";
import LoadedReviewProvider from "./business-logic/review/LoadedReviewProvider.tsx";
import Root from "./components/routes/Root/Root.tsx";
import getMessages from "./translations/getMessages.ts";

export default function App() {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={getMessages()}>
      {/* The color mode attributes are on `<html>`, so the page background
          and portals get the theme too. */}
      <ThemeProvider colorMode="auto" contextOnly>
        <BaseStyles>
          <LoadedReviewProvider>
            <LoadedReviewStateProvider>
              <Root />
            </LoadedReviewStateProvider>
          </LoadedReviewProvider>
        </BaseStyles>
      </ThemeProvider>
    </IntlProvider>
  );
}
