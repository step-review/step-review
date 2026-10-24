import { Link } from "@primer/react";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import styles from "./SidebarBrand.module.css";

const repositoryUrl = "https://github.com/step-review/step-review";
const authorUrl = "https://github.com/pscanf";

/** The app's name and tagline, leading to the start page, and its credits. */
export default function SidebarBrand() {
  return (
    <div className={styles["brand"]}>
      <button
        type="button"
        className={styles["home"]}
        onClick={() => navigateTo({ name: RouteName.Start })}
      >
        <Logo size={40} />
        <span className={styles["names"]}>
          <span className={styles["name"]}>Step Review</span>
          <span className={styles["tagline"]}>
            <FormattedMessage defaultMessage="A better way to review PRs" />
          </span>
        </span>
      </button>
      <p className={styles["credits"]}>
        <FormattedMessage
          defaultMessage="<project>A project</project> by <author>pscanf</author>"
          values={{
            project: (chunks: ReactNode[]) => (
              <Link href={repositoryUrl} target="_blank" rel="noreferrer">
                {chunks}
              </Link>
            ),
            author: (chunks: ReactNode[]) => (
              <Link href={authorUrl} target="_blank" rel="noreferrer">
                {chunks}
              </Link>
            ),
          }}
        />
      </p>
    </div>
  );
}
