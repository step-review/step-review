Read and follow every `AGENTS.md` from the repository root to the directory you
edit. More specific instructions take precedence within their scope.

Keep these files concise: document only principles that cannot readily be
inferred from the code. Omit examples and descriptions of existing structure.

# General principles and conventions

- The app has no users yet. Do not add backward-compatibility code or migrations
  for previous versions of the app's own state (local storage) unless explicitly
  requested. The review format is the exception: it is a public contract,
  versioned in `@step-review/review-format`. Changes must stay compatible with
  existing review files, or introduce a new format version.

- Name things in the code as the interface names them. Reviewing together
  happens in a collaboration session (a session, for short) that a review's
  owner starts and ends, and that others join; a session connection is one
  browser's link to a session.

- Avoid TypeScript’s `readonly` modifier unless an external API requires it.

- Name variables after the full class or returned object they represent. Do not
  shorten names in ways that obscure what the variable holds or produces.

- Add defensive checks only when strongly justified by a concrete reason. Always
  explain that reason in a comment beside the check.

- Review files are untrusted input. Never render their content as raw HTML.

- Sessions are end-to-end encrypted: the session server must never receive
  review content, participant names, progress or presence in plaintext, nor the
  session key. Encrypt in the browser with the key from the link's fragment, and
  treat everything decrypted as untrusted input, since other participants wrote
  it.

# Testing guidelines

- Do not write browser e2e tests. Use unit tests, and Vitest browser mode for
  component tests (`*.browser.test.tsx`).
- Always use Vitest, never Node’s built-in test runner (`node:test`).
- Write test descriptions in plain English. Name the action and expected result;
  avoid cryptic shorthand and abstract descriptions of implementation rules.
- Keep test fixtures to a minimum. Define test data inside each test. Never
  share test data between tests through variables, fixtures, or factories with
  predefined data, even when they return fresh objects. Only generic utilities
  that do not supply test data may be shared.
- Divide every test into comment-labeled sections separated by a blank line.
- Use `Setup mocks` only when mocking something, and `Setup SUT` only when
  initializing or setting up the system under test or other non-mock
  prerequisites.
- Put the behavior being tested and its specific input data and supporting
  objects in `Exercise`. Setup can generally serve tests of different behaviors;
  exercise code is specific to the behavior that test covers. Utility tests may
  omit `Setup SUT` when no setup is needed.
- Put all assertions and verifications in `Verify`. Combine exercise and
  verification into `Exercise and verify` only when they are essentially a
  one-liner.
- Test exactly one behavior per test, with a single exercise section followed by
  a single verify section. Never append another exercise and verification to an
  existing test, even when a separate test would repeat its setup line by line.
  Duplicate the setup instead: duplicated tests are far better than entangled
  ones where changing one check affects others.
- Use `it.each` only to run the same behavior against different input data,
  where every case shares one description, setup, exercise, and verification and
  differs only in values. Never use it to deduplicate tests of different
  scenarios or code paths. If the body branches on the parameter, or the cases
  would deserve different descriptions, write separate tests.
