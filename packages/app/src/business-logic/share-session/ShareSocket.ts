import type { ClientMessage, ServerMessage } from "@step-review/share-server";
import fetchShareInfo from "../sharing/fetchShareInfo.ts";
import parseServerMessage from "./parseServerMessage.ts";
import type ShareEndReason from "./ShareEndReason.ts";
import shareEndReasons from "./shareEndReasons.ts";
import type ShareSessionOptions from "./ShareSessionOptions.ts";
import shareSocketUrl from "./shareSocketUrl.ts";

/** How long to wait before each reconnection attempt, in milliseconds. */
const reconnectDelays = [1000, 2000, 5000, 10_000, 30_000];

interface ShareSocketHandlers {
  /** Called in order: the next message waits for the returned promise. */
  onMessage: (serverMessage: ServerMessage) => Promise<void>;
  /** The connection dropped; the socket reconnects. */
  onDisconnected: () => void;
  onEnded: (endReason: ShareEndReason) => void;
}

/**
 * The connection to a share's socket: joins on every connection, and reconnects
 * when it drops, unless the share can't be joined anymore.
 */
export default class ShareSocket {
  /** Increases with every connection, so that a send can target one. */
  connectionNumber = 0;
  /** Whether the current connection joined, so messages can be sent. */
  isJoined = false;
  private options: ShareSessionOptions;
  private handlers: ShareSocketHandlers;
  private webSocket: WebSocket | null = null;
  private isClosed = false;
  private messageQueue = Promise.resolve();
  private reconnectAttempt = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(options: ShareSessionOptions, handlers: ShareSocketHandlers) {
    this.options = options;
    this.handlers = handlers;
    this.connect();
  }

  /** Sends a message on the given connection, if it is still joined. */
  send(connectionNumber: number, clientMessage: ClientMessage): void {
    if (
      this.webSocket &&
      this.isJoined &&
      connectionNumber === this.connectionNumber
    ) {
      this.webSocket.send(JSON.stringify(clientMessage));
    }
  }

  close(): void {
    this.isClosed = true;
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
    }
    this.webSocket?.close();
  }

  private connect(): void {
    const { apiOrigin, shareId, participantId, participantSecret } =
      this.options;
    const webSocket = new WebSocket(shareSocketUrl(apiOrigin, shareId));
    this.webSocket = webSocket;
    this.connectionNumber++;
    this.isJoined = false;
    webSocket.addEventListener("open", () => {
      const joinMessage: ClientMessage = {
        type: "join",
        participantId,
        participantSecret,
      };
      webSocket.send(JSON.stringify(joinMessage));
    });
    webSocket.addEventListener("message", (event) => {
      const serverMessage = parseServerMessage(String(event.data));
      if (!serverMessage) {
        return;
      }
      this.messageQueue = this.messageQueue.then(async () => {
        if (webSocket !== this.webSocket) {
          return;
        }
        if (serverMessage.type === "joined") {
          this.isJoined = true;
          this.reconnectAttempt = 0;
        }
        await this.handlers.onMessage(serverMessage);
      });
    });
    webSocket.addEventListener("close", (event) => {
      void this.handleClose(event.code);
    });
  }

  private async handleClose(code: number): Promise<void> {
    const wasJoined = this.isJoined;
    this.webSocket = null;
    this.isJoined = false;
    this.handlers.onDisconnected();
    const endReason = shareEndReasons.get(code);
    if (endReason) {
      this.handlers.onEnded(endReason);
      return;
    }
    if (this.isClosed) {
      return;
    }
    // A socket to a missing share fails to open, with no close code to tell.
    if (!wasJoined) {
      const shareInfo = await fetchShareInfo(
        this.options.apiOrigin,
        this.options.shareId,
      ).catch(() => undefined);
      if (shareInfo === null) {
        this.handlers.onEnded("notFound");
        return;
      }
    }
    const delay =
      reconnectDelays[
        Math.min(this.reconnectAttempt, reconnectDelays.length - 1)
      ]!;
    this.reconnectAttempt++;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (!this.isClosed) {
        this.connect();
      }
    }, delay);
  }
}
