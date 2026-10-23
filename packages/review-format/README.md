# @step-review/review-format

The Step Review file format: Valibot schemas, the file parser, and the
consistency checks that the app reports to the user.

## Files

A review file (e.g. `pr-123.step-review`) is plain text: two sections, each
starting with a marker line.

```
#step-review:review
{ …JSON: target commits, overview, steps and notes… }
#step-review:diff
…output of git diff <base> <head>…
```

Marker lines can't be confused with content: diff lines start with a diff prefix
or a header keyword, and JSON strings can't span lines.

The JSON section is defined by `reviewDataSchema`, and published as JSON Schema
at `https://step-review.dev/schema/v2.json`. The agent instructions in
[`SKILL.md`](../app/public/SKILL.md) describe how to fill it.

## Compatibility

The format is a public contract: files written by agents must keep working.
Changes must be backward compatible within a version (new optional fields only),
or introduce a new `version`. Version 2 dropped the rounds of version 1 before
the app had users, so the app only reads version 2.
