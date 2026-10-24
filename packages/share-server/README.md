# @step-review/share-server

The server of shared reviews: a Cloudflare Worker with one Durable Object per
share, and the protocol the app speaks to it (`src/protocol`, exported for the
app).

## Encryption

The server stores and relays opaque data. Browsers encrypt the review, each
participant's state (name and viewed files) and presences (the step they are on)
with AES-GCM, using a random key that only the share's links hold, in their
fragment, which browsers don't send. The additional data of each envelope binds
it to its share and participant, so the server can't pass one off as another.
The server knows a share's size, when it is used, and how many participants it
has.

## API

Under `/api/shares/<shareId>`, where IDs are random and created by the browser:

- `GET` returns the version of the review to load; `DELETE`, by the owner,
  deletes the share.
- `…/review`: `PUT`, by the owner, uploads a new version of the review, and
  creates the share the first time. The owner proves themselves with the secret
  sent on creation, in `Authorization: Bearer`.
- `…/versions/<versionId>`: `GET` returns a version, cacheable forever. Only the
  latest is kept.
- `…/socket`: a WebSocket. Browsers join as a participant, with a secret that
  their first join registers, then get every participant's state and the
  presences, and the changes as they happen.

Participants only write their own state, so they never conflict with each other.
A write is based on the revision it was derived from, and is rejected when that
isn't the current one, e.g. after a write from another tab: the browser applies
its changes again to the current state.

Secrets are stored as hashes. A share is deleted after 30 days without activity.
Uploads are rate limited, and the sizes of reviews, states and presences, and
the number of participants, are limited (`shareLimits`).

## Development

`pnpm dev` at the repository root runs the server with the app. The tests start
it in the local Workers runtime, once for all tests; the app's share session
tests use the same server.
