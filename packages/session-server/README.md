# @step-review/session-server

The server of sessions: a Cloudflare Worker with one Durable Object per session,
and the protocol the app speaks to it (`src/protocol`, exported for the app).

## Encryption

The server stores and relays opaque data. Browsers encrypt the review, each
participant's state (name and viewed files) and presences (the step they are on)
with AES-GCM, using a random key that only the session's links hold, in their
fragment, which browsers don't send. The additional data of each envelope binds
it to its session and participant, so the server can't pass one off as another.
The server knows a session's size, when it is used, and how many participants it
has.

## API

Under `/api/sessions/<sessionId>`, where IDs are random and created by the
browser:

- `GET` tells whether the session exists; `DELETE`, by the owner, deletes it.
- `…/review`: `PUT` creates the session with its review, which never changes
  afterwards. Its `Authorization: Bearer` secret becomes the owner secret, which
  deleting the session takes. `GET` returns the review, cacheable forever.
- `…/socket`: a WebSocket. Browsers join as a participant, with a secret that
  their first join registers, then get every participant's state and the
  presences, and the changes as they happen.

Participants only write their own state, so they never conflict with each other.
A write is based on the revision it was derived from, and is rejected when that
isn't the current one, e.g. after a write from another tab: the browser applies
its changes again to the current state.

Secrets are stored as hashes. A session is deleted after 30 days without
activity. Uploads are rate limited, and the sizes of reviews, states and
presences, and the number of participants, are limited (`sessionLimits`).

## Development

`pnpm dev` at the repository root runs the server with the app. The tests start
it in the local Workers runtime, once for all tests; the app's session
connection tests use the same server.
