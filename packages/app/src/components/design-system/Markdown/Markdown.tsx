import type { ReactNode } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.css";

interface Props {
  children: string;
  /**
   * Renders links with a custom protocol (e.g. `note:n12`); return `null` to
   * render them as plain text.
   */
  renderCustomLink?: (href: string, children: ReactNode) => ReactNode;
}

const customLinkPattern = /^[a-z]+:(?!\/\/)/u;

/** Renders untrusted Markdown: raw HTML is shown as text, never rendered. */
export default function Markdown({ children, renderCustomLink }: Props) {
  return (
    <div className={styles["root"]}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) =>
          customLinkPattern.test(url) && !url.startsWith("mailto:")
            ? url
            : defaultUrlTransform(url)
        }
        components={{
          a: ({ href = "", children: linkChildren }) => {
            if (customLinkPattern.test(href) && !href.startsWith("mailto:")) {
              return renderCustomLink?.(href, linkChildren) ?? linkChildren;
            }
            return (
              <a href={href} target="_blank" rel="noreferrer">
                {linkChildren}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
