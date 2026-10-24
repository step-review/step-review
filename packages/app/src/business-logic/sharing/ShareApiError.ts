/** A share API request that failed, with the response's status. */
export default class ShareApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`The share API responded with status ${status}.`);
    this.status = status;
  }
}
