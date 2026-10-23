import { Button, Stack, Text } from "@primer/react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <Stack gap="normal" align="start" className={styles["page"]}>
      <Text>
        <FormattedMessage defaultMessage="Page not found." />
      </Text>
      <Button onClick={() => navigateTo({ name: RouteName.Start })}>
        <FormattedMessage defaultMessage="Go to the start page" />
      </Button>
    </Stack>
  );
}
