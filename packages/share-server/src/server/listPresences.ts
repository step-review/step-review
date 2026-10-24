import type ServerMessage from "../protocol/ServerMessage.ts";
import readAttachment from "./readAttachment.ts";

/** The presences set by the joined connections, but the given one. */
export default function listPresences(
  webSockets: WebSocket[],
  exceptWebSocket: WebSocket,
): Extract<ServerMessage, { type: "joined" }>["presences"] {
  return webSockets.flatMap((webSocket) => {
    const { connectionId, participantId, presence } = readAttachment(webSocket);
    return webSocket !== exceptWebSocket &&
      participantId !== null &&
      presence !== null
      ? [{ connectionId, participantId, presence }]
      : [];
  });
}
