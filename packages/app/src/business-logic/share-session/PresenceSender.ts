import encryptPresence from "./encryptPresence.ts";
import type PresenceLocation from "./PresenceLocation.ts";
import type ShareSessionOptions from "./ShareSessionOptions.ts";
import type ShareSocket from "./ShareSocket.ts";
import Throttle from "./Throttle.ts";

/** The least time between two presences, which change while scrolling. */
const presenceInterval = 500;

/** Sends where the participant is, at most once per interval. */
export default class PresenceSender {
  private options: ShareSessionOptions;
  private shareSocket: ShareSocket;
  /** `undefined` until set. */
  private presenceLocation: PresenceLocation | undefined;
  private presenceThrottle = new Throttle(
    () => void this.send(),
    presenceInterval,
  );

  constructor(options: ShareSessionOptions, shareSocket: ShareSocket) {
    this.options = options;
    this.shareSocket = shareSocket;
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
    if (!this.shareSocket.isJoined || !presenceLocation) {
      return;
    }
    const { connectionNumber } = this.shareSocket;
    const { shareKey, shareId, participantId } = this.options;
    const presence = await encryptPresence(
      shareKey,
      shareId,
      participantId,
      presenceLocation,
    );
    this.shareSocket.send(connectionNumber, { type: "setPresence", presence });
  }
}
