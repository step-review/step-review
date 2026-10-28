import { FormattedMessage } from "react-intl";
import isPlainClick from "../../../business-logic/navigation/isPlainClick.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import ProjectCredits from "../ProjectCredits/ProjectCredits.tsx";
import styles from "./AppBrand.module.css";

/** The app's name and tagline, leading to the start page, and its credits. */
export default function AppBrand() {
  return (
    <div className={styles["brand"]}>
      <a
        href={routeHref({ name: RouteName.Start })}
        className={styles["home"]}
        onClick={(event) => {
          if (isPlainClick(event)) {
            event.preventDefault();
            navigateTo({ name: RouteName.Start });
          }
        }}
      >
        <Logo size={32} />
        <span className={styles["names"]}>
          <span className={styles["name"]}>Step Review</span>
          <span className={styles["tagline"]}>
            <FormattedMessage defaultMessage="A better way to review PRs" />
          </span>
        </span>
      </a>
      <ProjectCredits />
    </div>
  );
}
