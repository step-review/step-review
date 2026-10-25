import encryptPresence from "./encryptPresence.ts";
import type PresenceLocation from "./PresenceLocation.ts";
import type SessionConnectionOptions from "./SessionConnectionOptions.ts";
import type SessionSocket from "./SessionSocket.ts";
import Throttle from "./Throttle.ts";

/** The least time between two presences, which change while scrolling. */
const presenceInterval = 500;

/** Sends where the participant is, at most once per interval. */
export default class PresenceSender {
  private options: SessionConnectionOptions;
  private sessionSocket: SessionSocket;
  /** `undefined` until set. */
  private presenceLocation: PresenceLocation | undefined;
  private presenceThrottle = new Throttle(
    () => void this.send(),
    presenceInterval,
  );

  constructor(options: SessionConnectionOptions, sessionSocket: SessionSocket) {
    this.options = options;
    this.sessionSocket = sessionSocket;
  }

  set(presenceLocation: PresenceLocation): void {
    this.presenceLocation = presenceLocation;
    this.presenceThrottle.request();
  }

  /** Sends the presence again, e.g. to a new connection. */
  resend(): void {
    this.presenceThrottle.request();
  }

  cancel(): void {
    this.presenceThrottle.cancel();
  }

  private async send(): Promise<void> {
    const { presenceLocation } = this;
    if (!this.sessionSocket.isJoined || !presenceLocation) {
      return;
    }
    const { connectionNumber } = this.sessionSocket;
    const { sessionKey, sessionId, participantId } = this.options;
    const presence = await encryptPresence(
      sessionKey,
      sessionId,
      participantId,
      presenceLocation,
    );
    this.sessionSocket.send(connectionNumber, {
      type: "setPresence",
      presence,
    });
  }
}
