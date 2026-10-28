import { FormattedMessage } from "react-intl";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import ProjectCredits from "../ProjectCredits/ProjectCredits.tsx";
import RouteLink from "../RouteLink/RouteLink.tsx";
import styles from "./AppBrand.module.css";

/** The app's name and tagline, leading to the start page, and its credits. */
export default function AppBrand() {
  return (
    <div className={styles["brand"]}>
      <RouteLink route={{ name: RouteName.Start }} className={styles["home"]}>
        <Logo size={32} />
        <span className={styles["names"]}>
          <span className={styles["name"]}>Step Review</span>
          <span className={styles["tagline"]}>
            <FormattedMessage defaultMessage="A better way to review PRs" />
          </span>
        </span>
      </RouteLink>
      <ProjectCredits />
    </div>
  );
}
