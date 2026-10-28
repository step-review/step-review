# Changelog

## 1.3.0

- The prompt on the start page can be saved as a template: while it contains
  `PR_LINK_HERE`, its button saves it in the browser, and the prompt starts from
  it from then on. The prompt box grows as it is written.
- Once a review was opened or a session joined, the start page no longer
  introduces the app, even after all reviews are removed.

## 1.2.1

- Links to the app's pages, such as the logo, the steps in the sidebar, the
  previous and next step buttons and the example review, open in a new tab on a
  Cmd- or Ctrl-click.

## 1.2.0

- Step Review can be installed as an app from Chrome or Edge on desktop, and the
  installed app opens `.step-review` files from the operating system.

## 1.1.3

- The skill runs an installed `step-review` CLI first, and asks the user to
  allow or install the CLI when running it is blocked, instead of building the
  review file by hand.
- Review files built by hand no longer break when the JSON has no trailing
  newline.

## 1.1.2

- The collapsed sidebar's attention and presence badges no longer cover the step
  number.
- Split view shows notes inline, so every file's two halves are equally wide.
- The line number gutter is as wide as the file's largest line number.

## 1.1.1

- The sidebar draws modified files' icons as large as added and deleted ones.

## 1.1.0

- The sidebar shows each file's status (added, deleted, modified, renamed,
  copied) in place of its file type icon, and strikes deleted files through.
- Deleted files start collapsed.

## 1.0.0

- Initial release.
