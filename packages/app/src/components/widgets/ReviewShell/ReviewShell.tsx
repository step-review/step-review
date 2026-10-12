import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  ScrollArea,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFolders, IconMessages } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import type RoundView from "../../../business-logic/rounds/RoundView.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import FeedbackModal from "../FeedbackModal/FeedbackModal.tsx";
import FileTreeDrawer from "../FileTreeDrawer/FileTreeDrawer.tsx";
import ReloadDropzone from "../ReloadDropzone/ReloadDropzone.tsx";
import ReviewMenu from "../ReviewMenu/ReviewMenu.tsx";
import ReviewSearch from "../ReviewSearch/ReviewSearch.tsx";
import RoundSwitcher from "../RoundSwitcher/RoundSwitcher.tsx";
import StepNavigation from "../StepNavigation/StepNavigation.tsx";
import styles from "./ReviewShell.module.css";

interface Props {
  loadedReview: LoadedReview;
  roundView: RoundView;
  activeStepId: string | null;
  children: ReactNode;
}

export default function ReviewShell({
  loadedReview,
  roundView,
  activeStepId,
  children,
}: Props) {
  const intl = useIntl();
  const [isNavbarOpen, navbar] = useDisclosure(false);
  const [isFileTreeOpen, fileTree] = useDisclosure(false);
  const [isFeedbackOpen, feedback] = useDisclosure(false);
  const { reviewState } = useReviewState();
  const feedbackCount =
    Object.values(reviewState.issueVerdicts).filter(
      (issueVerdict) =>
        issueVerdict.verdict !== null || issueVerdict.reply.trim() !== "",
    ).length + reviewState.comments.length;
  return (
    <AppShell
      header={{ height: 52 }}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: { mobile: !isNavbarOpen },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm" wrap="nowrap">
          <Burger
            opened={isNavbarOpen}
            onClick={navbar.toggle}
            hiddenFrom="md"
            size="sm"
          />
          <Group
            gap={8}
            wrap="nowrap"
            className={styles["brand"]}
            onClick={() => navigateTo({ name: RouteName.Start })}
          >
            <Logo size={26} />
            <Text fw={700} visibleFrom="sm">
              step-review
            </Text>
          </Group>
          <RoundSwitcher
            reviewFile={loadedReview.reviewFile}
            roundNumber={roundView.round.number}
          />
          <Group gap="xs" ml="auto" wrap="nowrap">
            <ReviewSearch roundView={roundView} />
            <Tooltip
              label={<FormattedMessage defaultMessage="All files" />}
              withArrow
            >
              <ActionIcon
                variant="default"
                onClick={fileTree.open}
                aria-label={intl.formatMessage({ defaultMessage: "All files" })}
              >
                <IconFolders size={16} />
              </ActionIcon>
            </Tooltip>
            <Button
              variant="default"
              size="xs"
              leftSection={<IconMessages size={14} />}
              onClick={feedback.open}
            >
              <Box component="span" visibleFrom="sm">
                <FormattedMessage defaultMessage="Feedback" />
              </Box>
              &nbsp;({feedbackCount})
            </Button>
            <ReviewMenu loadedReview={loadedReview} />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section p="md" pb="xs">
          <Text fw={600} lineClamp={3}>
            {roundView.round.data.target.title}
          </Text>
          <Text size="xs" c="dimmed" ff="monospace" truncate>
            {loadedReview.fileName}
          </Text>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} px="md" pb="md">
          <StepNavigation
            roundView={roundView}
            activeStepId={activeStepId}
            onNavigate={navbar.close}
          />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <FileTreeDrawer
        roundView={roundView}
        opened={isFileTreeOpen}
        onClose={fileTree.close}
      />
      <FeedbackModal
        loadedReview={loadedReview}
        opened={isFeedbackOpen}
        onClose={feedback.close}
      />
      <ReloadDropzone />
    </AppShell>
  );
}
