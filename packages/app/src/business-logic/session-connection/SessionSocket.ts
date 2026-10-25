import type { ClientMessage, ServerMessage } from "@step-review/session-server";
import fetchSessionExists from "../session/fetchSessionExists.ts";
import parseServerMessage from "./parseServerMessage.ts";
import type SessionConnectionOptions from "./SessionConnectionOptions.ts";
import type SessionEndReason from "./SessionEndReason.ts";
import sessionEndReasons from "./sessionEndReasons.ts";
import sessionSocketUrl from "./sessionSocketUrl.ts";

/** How long to wait before each reconnection attempt, in milliseconds. */
const reconnectDelays = [1000, 2000, 5000, 10_000, 30_000];

interface SessionSocketHandlers {
  /** Called in order: the next message waits for the returned promise. */
  onMessage: (serverMessage: ServerMessage) => Promise<void>;
  /** The connection dropped; the socket reconnects. */
  onDisconnected: () => void;
  onEnded: (endReason: SessionEndReason) => void;
}

/**
 * The connection to a session's socket: joins on every connection, and
 * reconnects when it drops, unless the session can't be joined anymore.
 */
export default class SessionSocket {
  /** Increases with every connection, so that a send can target one. */
  connectionNumber = 0;
  /** Whether the current connection joined, so messages can be sent. */
  isJoined = false;
  private options: SessionConnectionOptions;
  private handlers: SessionSocketHandlers;
  private webSocket: WebSocket | null = null;
  private isClosed = false;
  private messageQueue = Promise.resolve();
  private reconnectAttempt = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    options: SessionConnectionOptions,
    handlers: SessionSocketHandlers,
  ) {
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

  /** Closes the connection for good, for a reason found in the browser. */
  end(endReason: SessionEndReason): void {
    this.close();
    this.handlers.onEnded(endReason);
  }

  private connect(): void {
    const { apiOrigin, sessionId, participantId, participantSecret } =
      this.options;
    const webSocket = new WebSocket(sessionSocketUrl(apiOrigin, sessionId));
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
    // Closed by the browser, e.g. ended: nothing to tell or reconnect.
    if (this.isClosed) {
      return;
    }
    this.handlers.onDisconnected();
    const endReason = sessionEndReasons.get(code);
    if (endReason) {
      this.handlers.onEnded(endReason);
      return;
    }
    // A socket to a missing session fails to open, with no close code to tell.
    if (!wasJoined) {
      const sessionExists = await fetchSessionExists(
        this.options.apiOrigin,
        this.options.sessionId,
      ).catch(() => undefined);
      if (sessionExists === false) {
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
