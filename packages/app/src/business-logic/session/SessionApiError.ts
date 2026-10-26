/** A session API request that failed, with the response's status. */
export default class SessionApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`The session API responded with status ${status}.`);
    this.status = status;
  }
}
