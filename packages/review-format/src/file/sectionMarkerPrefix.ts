/**
 * Marker lines start a section of a review file: `#step-review:review` or
 * `#step-review:diff`. They cannot be confused with content: diff lines start
 * with a diff prefix or a header keyword, and JSON strings cannot span lines.
 */
export default "#step-review:";
