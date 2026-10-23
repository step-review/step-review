import { AppShell, Burger, Group, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import ReloadDropzone from "../ReloadDropzone/ReloadDropzone.tsx";
import ReviewMenu from "../ReviewMenu/ReviewMenu.tsx";
import StepNavigation from "../StepNavigation/StepNavigation.tsx";
import styles from "./ReviewShell.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  activeStepId: string | null;
  children: ReactNode;
}

export default function ReviewShell({
  loadedReview,
  reviewView,
  activeStepId,
  children,
}: Props) {
  const [isNavbarOpen, navbar] = useDisclosure(false);
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
              Step Review
            </Text>
          </Group>
          <Group gap="xs" ml="auto" wrap="nowrap">
            <ReviewMenu loadedReview={loadedReview} />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section p="md" pb="xs">
          <Text fw={600} lineClamp={3}>
            {reviewView.data.target.title}
          </Text>
          <Text size="xs" c="dimmed" ff="monospace" truncate>
            {loadedReview.fileName}
          </Text>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} px="md" pb="md">
          <StepNavigation
            reviewView={reviewView}
            activeStepId={activeStepId}
            onNavigate={navbar.close}
          />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <ReloadDropzone />
    </AppShell>
  );
}
