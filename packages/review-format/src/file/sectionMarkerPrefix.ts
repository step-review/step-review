/**
 * Marker lines start a section of a review file: `#step-review:round`,
 * `#step-review:diff` or `#step-review:interdiff`. They cannot be confused with
 * content: diff lines start with a diff prefix or a header keyword, and JSON
 * strings cannot span lines.
 */
export default "#step-review:";
