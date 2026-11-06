# Changelog

## 1.5.0

- The step's file tree in the sidebar highlights the file being read, one that
  crosses a line a third down the page or the one a link just went to, and sets
  the folders it's in in bold. The sidebar scrolls along to keep it in view,
  unless it was scrolled away from it.

## 1.4.0

- The step page repeats its Mark all as viewed button below the last file, so it
  is at hand without scrolling back up.

## 1.3.3

- The prompt on the start page also hides its copy and save buttons while it is
  an unchanged saved template, until it is edited.

## 1.3.2

- The prompt on the start page shows no copy or save button while it is the
  untouched default prompt, which has no PR link to copy. Saving stays offered
  while another template is saved, to bring the default back.

## 1.3.1

- A file path too long for its file card's header is cut off from the start,
  instead of pushing the diffstat and Viewed checkbox onto another line.

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
