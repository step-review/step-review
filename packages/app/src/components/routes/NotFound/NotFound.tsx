import { Button, Container, Stack, Text } from "@mantine/core";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";

export default function NotFound() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="md" align="flex-start">
        <Text>
          <FormattedMessage defaultMessage="Page not found." />
        </Text>
        <Button
          variant="light"
          onClick={() => navigateTo({ name: RouteName.Start })}
        >
          <FormattedMessage defaultMessage="Go to the start page" />
        </Button>
      </Stack>
    </Container>
  );
}
