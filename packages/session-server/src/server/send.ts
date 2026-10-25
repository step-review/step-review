import type ServerMessage from "../protocol/ServerMessage.ts";

export default function send(
  webSocket: WebSocket,
  serverMessage: ServerMessage,
): void {
  try {
    webSocket.send(JSON.stringify(serverMessage));
  } catch {
    // The socket can be closing while it is still listed: it gets the current
    // state when it reconnects.
  }
}
