import { DurableObject } from "cloudflare:workers";
import type ClientMessage from "../protocol/ClientMessage.ts";
import type ServerMessage from "../protocol/ServerMessage.ts";
import sessionCloseCodes from "../protocol/sessionCloseCodes.ts";
import type SessionInfo from "../protocol/SessionInfo.ts";
import sessionLimits from "../protocol/sessionLimits.ts";
import type ConnectionAttachment from "./ConnectionAttachment.ts";
import hashSecret from "./hashSecret.ts";
import listPresences from "./listPresences.ts";
import parseClientMessage from "./parseClientMessage.ts";
import randomId from "./randomId.ts";
import readAttachment from "./readAttachment.ts";
import send from "./send.ts";
import SessionStore from "./SessionStore.ts";
import writeAttachment from "./writeAttachment.ts";

/**
 * One session: stores its encrypted review and participant states, and relays
 * changes and presences between the connected browsers. It can't read any of
 * them: they're encrypted with a key that only the session's links hold.
 */
export default class SessionObject extends DurableObject {
  private sessionStore = new SessionStore(this.ctx.storage);

  /** Creates the session, or replaces its review if the owner secret matches. */
  async saveReview(
    ownerSecret: string,
    review: ArrayBuffer,
  ): Promise<SessionInfo | null> {
    const ownerSecretHash = await hashSecret(ownerSecret);
    const session = this.sessionStore.readSession();
    if (session && session.ownerSecretHash !== ownerSecretHash) {
      return null;
    }
    const versionId = randomId();
    this.sessionStore.writeReview(ownerSecretHash, versionId, review);
    await this.extendLifetime();
    this.broadcast({ type: "reviewVersion", versionId });
    return { versionId };
  }

  readSessionInfo(): SessionInfo | null {
    const session = this.sessionStore.readSession();
    return session && { versionId: session.versionId };
  }

  /** Only the latest version is kept: older ones are `null`. */
  readReview(versionId: string): ArrayBuffer | null {
    return this.sessionStore.readSession()?.versionId === versionId
      ? this.sessionStore.readReview()
      : null;
  }

  async deleteSession(
    ownerSecret: string,
  ): Promise<"deleted" | "forbidden" | "notFound"> {
    const ownerSecretHash = await hashSecret(ownerSecret);
    const session = this.sessionStore.readSession();
    if (!session) {
      return "notFound";
    }
    if (session.ownerSecretHash !== ownerSecretHash) {
      return "forbidden";
    }
    await this.removeSession();
    return "deleted";
  }

  /** Expires the session after a period without activity. */
  override async alarm(): Promise<void> {
    await this.removeSession();
  }

  /** Opens a socket, which joins with its first message. */
  override fetch(): Response {
    if (!this.sessionStore.exists()) {
      return new Response(null, { status: 404 });
    }
    const [client, server] = Object.values(new WebSocketPair()) as [
      WebSocket,
      WebSocket,
    ];
    this.ctx.acceptWebSocket(server);
    writeAttachment(server, {
      connectionId: randomId(),
      participantId: null,
      presence: null,
    });
    return new Response(null, { status: 101, webSocket: client });
  }

  override async webSocketMessage(
    webSocket: WebSocket,
    message: string | ArrayBuffer,
  ): Promise<void> {
    const clientMessage = parseClientMessage(message);
    const attachment = readAttachment(webSocket);
    // A connection joins with its first message, and only then.
    if (
      !clientMessage ||
      (clientMessage.type === "join") !== (attachment.participantId === null)
    ) {
      webSocket.close(sessionCloseCodes.invalidMessage, "Invalid message");
      return;
    }
    switch (clientMessage.type) {
      case "join":
        await this.join(webSocket, attachment, clientMessage);
        return;
      case "writeState":
        await this.writeState(webSocket, attachment, clientMessage);
        return;
      case "setPresence":
        writeAttachment(webSocket, {
          ...attachment,
          presence: clientMessage.presence,
        });
        this.broadcast(
          {
            type: "presence",
            connectionId: attachment.connectionId,
            participantId: attachment.participantId!,
            presence: clientMessage.presence,
          },
          webSocket,
        );
    }
  }

  override webSocketClose(webSocket: WebSocket): void {
    const attachment = readAttachment(webSocket);
    if (attachment.participantId !== null) {
      this.broadcast(
        { type: "presenceEnded", connectionId: attachment.connectionId },
        webSocket,
      );
    }
  }

  private async join(
    webSocket: WebSocket,
    attachment: ConnectionAttachment,
    joinMessage: Extract<ClientMessage, { type: "join" }>,
  ): Promise<void> {
    const secretHash = await hashSecret(joinMessage.participantSecret);
    const session = this.sessionStore.readSession();
    if (!session) {
      webSocket.close(sessionCloseCodes.sessionNotFound, "Session not found");
      return;
    }
    const participant = this.sessionStore.readParticipant(
      joinMessage.participantId,
    );
    if (participant && participant.secretHash !== secretHash) {
      webSocket.close(sessionCloseCodes.forbidden, "Wrong participant secret");
      return;
    }
    if (!participant) {
      if (
        this.sessionStore.countParticipants() >= sessionLimits.maxParticipants
      ) {
        webSocket.close(
          sessionCloseCodes.tooManyParticipants,
          "Too many participants",
        );
        return;
      }
      this.sessionStore.addParticipant(joinMessage.participantId, secretHash);
    }
    writeAttachment(webSocket, {
      ...attachment,
      participantId: joinMessage.participantId,
    });
    send(webSocket, {
      type: "joined",
      connectionId: attachment.connectionId,
      versionId: session.versionId,
      participantStates: this.sessionStore.readParticipantStates(),
      presences: listPresences(this.ctx.getWebSockets(), webSocket),
    });
    await this.extendLifetime();
  }

  private async writeState(
    webSocket: WebSocket,
    attachment: ConnectionAttachment,
    writeMessage: Extract<ClientMessage, { type: "writeState" }>,
  ): Promise<void> {
    const participantId = attachment.participantId!;
    // Added when joining, and only removed with the session and its sockets.
    const participant = this.sessionStore.readParticipant(participantId)!;
    if (participant.revision !== writeMessage.revision) {
      send(webSocket, {
        type: "stateRejected",
        revision: participant.revision,
        state: participant.state,
      });
      return;
    }
    const revision = participant.revision + 1;
    this.sessionStore.writeParticipantState(
      participantId,
      revision,
      writeMessage.state,
    );
    send(webSocket, { type: "stateWritten", revision });
    this.broadcast(
      {
        type: "participantState",
        participantId,
        revision,
        state: writeMessage.state,
      },
      webSocket,
    );
    await this.extendLifetime();
  }

  private async extendLifetime(): Promise<void> {
    await this.ctx.storage.setAlarm(
      Date.now() + sessionLimits.inactivityLifetime,
    );
  }

  private async removeSession(): Promise<void> {
    for (const webSocket of this.ctx.getWebSockets()) {
      webSocket.close(sessionCloseCodes.sessionNotFound, "Session deleted");
    }
    await this.ctx.storage.deleteAlarm();
    await this.ctx.storage.deleteAll();
  }

  /** Sends a message to the joined connections, but the given one. */
  private broadcast(
    serverMessage: ServerMessage,
    exceptWebSocket?: WebSocket,
  ): void {
    for (const webSocket of this.ctx.getWebSockets()) {
      if (
        webSocket !== exceptWebSocket &&
        readAttachment(webSocket).participantId !== null
      ) {
        send(webSocket, serverMessage);
      }
    }
  }
}
