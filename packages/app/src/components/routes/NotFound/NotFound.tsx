import { Button, Stack, Text } from "@primer/react";
import { FormattedMessage } from "react-intl";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import RouteLink from "../../widgets/RouteLink/RouteLink.tsx";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <Stack gap="normal" align="start" className={styles["page"]}>
      <Text>
        <FormattedMessage defaultMessage="Page not found." />
      </Text>
      <Button as={RouteLink} route={{ name: RouteName.Start }}>
        <FormattedMessage defaultMessage="Go to the start page" />
      </Button>
    </Stack>
  );
}
