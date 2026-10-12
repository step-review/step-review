/** Indents text as a Markdown blockquote inside a list item. */
export default function quoteMarkdown(text: string): string {
  return text
    .trim()
    .split("\n")
    .map((line) => `  > ${line}`.trimEnd())
    .join("\n");
}
