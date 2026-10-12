const workerNotFoundErrorCodes = [10007, 10090];

/** A preview Worker, managed through the Cloudflare API. */
export default class CloudflareWorker {
  private workerName: string;
  private accountId: string;
  private apiToken: string;

  constructor(
    workerName: string,
    accountId = process.env["CLOUDFLARE_ACCOUNT_ID"],
    apiToken = process.env["CLOUDFLARE_API_TOKEN"],
  ) {
    // Only previews can be deleted, never the production Worker.
    if (!/^step-review-pr-[1-9]\d{0,9}$/u.test(workerName)) {
      throw new Error("Unexpected preview Worker name.");
    }
    if (!accountId || !apiToken) {
      throw new Error("Missing Cloudflare account ID or API token.");
    }
    this.workerName = workerName;
    this.accountId = accountId;
    this.apiToken = apiToken;
  }

  async delete(): Promise<void> {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/workers/services/${this.workerName}?force=true`;
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.apiToken}` },
    });
    const responseBody = (await response.text()).trim();
    let apiErrors: { code: number; message: string }[] = [];
    try {
      const parsedResponseBody = JSON.parse(responseBody) as {
        success: boolean;
        errors?: { code: number; message: string }[];
      };
      if (parsedResponseBody.success) {
        return;
      }
      apiErrors = parsedResponseBody.errors ?? [];
    } catch {
      throw new Error(
        `Deleting Worker ${this.workerName} failed with status ${response.status}: ${responseBody}`,
      );
    }
    if (
      apiErrors.some((apiError) =>
        workerNotFoundErrorCodes.includes(apiError.code),
      )
    ) {
      return;
    }
    throw new Error(
      `Deleting Worker ${this.workerName} failed: ${apiErrors
        .map((apiError) => `${apiError.message} [code: ${apiError.code}]`)
        .join(", ")}`,
    );
  }
}
