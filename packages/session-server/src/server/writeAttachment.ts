import type ConnectionAttachment from "./ConnectionAttachment.ts";

export default function writeAttachment(
  webSocket: WebSocket,
  attachment: ConnectionAttachment,
): void {
  webSocket.serializeAttachment(attachment);
}
