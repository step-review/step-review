import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
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
  const theme = useMantineTheme();
  const [isNavbarOpen, navbar] = useDisclosure(false);
  // On wide screens the navbar is always shown and holds the brand, so the
  // header, which only opens the navbar, is hidden.
  const isNavbarPinned = useMediaQuery(
    `(min-width: ${theme.breakpoints.md})`,
    true,
    { getInitialValueInEffect: false },
  );
  const goToStart = () => navigateTo({ name: RouteName.Start });
  return (
    <AppShell
      header={{ height: 52, collapsed: isNavbarPinned }}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: { mobile: !isNavbarOpen },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm" wrap="nowrap">
          <Burger opened={isNavbarOpen} onClick={navbar.toggle} size="sm" />
          <Group
            gap={8}
            wrap="nowrap"
            className={styles["brand"]}
            onClick={goToStart}
          >
            <Logo size={26} />
            <Text fw={700}>Step Review</Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section pt="sm" px="sm" pb="md" visibleFrom="md">
          <Group
            gap={8}
            wrap="nowrap"
            className={styles["brand"]}
            onClick={goToStart}
          >
            <Logo size={22} />
            <Text fw={700} size="sm">
              Step Review
            </Text>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} px="sm" py="sm">
          <StepNavigation
            reviewView={reviewView}
            activeStepId={activeStepId}
            onNavigate={navbar.close}
          />
        </AppShell.Section>
        <AppShell.Section p="xs" className={styles["footer"]}>
          <ReviewMenu loadedReview={loadedReview} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <ReloadDropzone />
    </AppShell>
  );
}
