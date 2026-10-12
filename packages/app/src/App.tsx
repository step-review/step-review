import { MantineProvider } from "@mantine/core";
import { IntlProvider } from "react-intl";
import LoadedReviewStateProvider from "./business-logic/review-state/LoadedReviewStateProvider.tsx";
import LoadedReviewProvider from "./business-logic/review/LoadedReviewProvider.tsx";
import Root from "./components/routes/Root/Root.tsx";
import createAppTheme from "./createAppTheme.ts";
import getMessages from "./translations/getMessages.ts";

const theme = createAppTheme();

export default function App() {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={getMessages()}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <LoadedReviewProvider>
          <LoadedReviewStateProvider>
            <Root />
          </LoadedReviewStateProvider>
        </LoadedReviewProvider>
      </MantineProvider>
    </IntlProvider>
  );
}
