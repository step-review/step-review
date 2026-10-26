# @step-review/review-format

The Step Review file format: Valibot schemas, the file parser, and the
consistency checks that the app reports to the user.

## Files

A review file (e.g. `pr-123-20261025-143012.step-review`) is plain text: two
sections, each starting with a marker line.

```
#step-review:review
{ …JSON: target commits, overview, steps and notes… }
#step-review:diff
…output of git diff <base> <head>…
```

Marker lines can't be confused with content: diff lines start with a diff prefix
or a header keyword, and JSON strings can't span lines.

The JSON section is defined by `reviewDataSchema`, and published as JSON Schema
at `https://step-review.dev/schema/v3.json`. The agent instructions in
[`SKILL.md`](../app/public/SKILL.md) describe how to fill it.

## Compatibility

Agents write review files for the app to open right away; nobody opens old ones.
So the app reads only the current `version` (`formatVersion`), with no
compatibility code: bump it whenever a change makes older files invalid. Ship
format changes in a release, so that the deployed app and the published CLI
always agree.
