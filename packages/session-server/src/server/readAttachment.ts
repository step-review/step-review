import type ConnectionAttachment from "./ConnectionAttachment.ts";

export default function readAttachment(
  webSocket: WebSocket,
): ConnectionAttachment {
  return webSocket.deserializeAttachment() as ConnectionAttachment;
}
