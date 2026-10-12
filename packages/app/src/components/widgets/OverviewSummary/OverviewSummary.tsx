import { List, Paper, SimpleGrid, Stack, Title } from "@mantine/core";
import { FormattedMessage } from "react-intl";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";

export default function OverviewSummary() {
  const { overview } = useCurrentRoundView().round.data;
  return (
    <Stack gap="md">
      <ReviewMarkdown>{overview.summary}</ReviewMarkdown>
      {overview.areas && overview.areas.length > 0 && (
        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="sm">
          {overview.areas.map((area, index) => (
            <Paper key={index} withBorder p="sm">
              <Title order={5} mb={6}>
                {area.title}
              </Title>
              <List size="sm" spacing={4}>
                {area.points.map((point, pointIndex) => (
                  <List.Item key={pointIndex}>
                    <ReviewMarkdown>{point}</ReviewMarkdown>
                  </List.Item>
                ))}
              </List>
            </Paper>
          ))}
        </SimpleGrid>
      )}
      {overview.readingPlan && (
        <div>
          <Title order={4} mb={6}>
            <FormattedMessage defaultMessage="How to read this review" />
          </Title>
          <ReviewMarkdown>{overview.readingPlan}</ReviewMarkdown>
        </div>
      )}
    </Stack>
  );
}
