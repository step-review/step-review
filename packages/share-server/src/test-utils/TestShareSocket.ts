import { inject } from "vitest";
import type ClientMessage from "../protocol/ClientMessage.ts";
import type ServerMessage from "../protocol/ServerMessage.ts";
import shareApiPaths from "../protocol/shareApiPaths.ts";

/** A share socket for tests, which waits for messages one at a time. */
export default class TestShareSocket {
  /** Resolves with the close code once the server closes the socket. */
  closed: Promise<number>;
  private webSocket: WebSocket;
  private receivedMessages: ServerMessage[] = [];
  private waitingResolvers: ((serverMessage: ServerMessage) => void)[] = [];

  private constructor(webSocket: WebSocket) {
    this.webSocket = webSocket;
    this.closed = new Promise((resolve) =>
      webSocket.addEventListener("close", (event) => resolve(event.code)),
    );
    webSocket.addEventListener("message", (event) => {
      const serverMessage = JSON.parse(String(event.data)) as ServerMessage;
      const resolve = this.waitingResolvers.shift();
      if (resolve) {
        resolve(serverMessage);
      } else {
        this.receivedMessages.push(serverMessage);
      }
    });
  }

  static async open(shareId: string): Promise<TestShareSocket> {
    const url = new URL(
      shareApiPaths.socket(shareId),
      inject("shareServerOrigin"),
    );
    url.protocol = "ws:";
    const webSocket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      webSocket.addEventListener("open", resolve);
      webSocket.addEventListener("error", reject);
    });
    return new TestShareSocket(webSocket);
  }

  send(clientMessage: ClientMessage | string): void {
    this.webSocket.send(
      typeof clientMessage === "string"
        ? clientMessage
        : JSON.stringify(clientMessage),
    );
  }

  nextMessage(): Promise<ServerMessage> {
    const serverMessage = this.receivedMessages.shift();
    return serverMessage
      ? Promise.resolve(serverMessage)
      : new Promise((resolve) => this.waitingResolvers.push(resolve));
  }

  close(): void {
    this.webSocket.close();
  }
}
