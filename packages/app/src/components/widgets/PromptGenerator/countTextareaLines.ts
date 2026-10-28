/** How many lines the textarea's text takes, wrapped to its width. */
export default function countTextareaLines(
  textarea: HTMLTextAreaElement,
): number {
  const rows = textarea.rows;
  textarea.rows = 2;
  const twoRowsHeight = textarea.clientHeight;
  textarea.rows = 1;
  const oneRowHeight = textarea.clientHeight;
  const lineHeight = twoRowsHeight - oneRowHeight;
  const lineCount =
    1 + Math.round((textarea.scrollHeight - oneRowHeight) / lineHeight);
  textarea.rows = rows;
  return lineCount;
}
