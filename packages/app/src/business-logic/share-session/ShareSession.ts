import type { ServerMessage } from "@step-review/share-server";
import currentOwnState from "../participant-state/currentOwnState.ts";
import nextOwnStateWrite from "../participant-state/nextOwnStateWrite.ts";
import type OwnStateSync from "../participant-state/OwnStateSync.ts";
import type OwnStateSyncEvent from "../participant-state/OwnStateSyncEvent.ts";
import type ParticipantStateAction from "../participant-state/ParticipantStateAction.ts";
import reduceOwnStateSync from "../participant-state/reduceOwnStateSync.ts";
import encryptJson from "../share-crypto/encryptJson.ts";
import shareAdditionalData from "../share-crypto/shareAdditionalData.ts";
import decryptJoinedMessage from "./decryptJoinedMessage.ts";
import decryptParticipantState from "./decryptParticipantState.ts";
import decryptPresence from "./decryptPresence.ts";
import encryptPresence from "./encryptPresence.ts";
import type PresenceLocation from "./PresenceLocation.ts";
import type ShareSessionOptions from "./ShareSessionOptions.ts";
import type ShareSessionSnapshot from "./ShareSessionSnapshot.ts";
import ShareSocket from "./ShareSocket.ts";
import Throttle from "./Throttle.ts";

/** The least time between two presences, which change while scrolling. */
const presenceInterval = 500;

/**
 * A live connection to a share: keeps the own state stored, and the others'
 * states and presences up to date.
 */
export default class ShareSession {
  private options: ShareSessionOptions;
  private snapshot: ShareSessionSnapshot;
  private ownStateSync: OwnStateSync = {
    revision: 0,
    storedState: null,
    pendingActions: [],
    inFlightWrite: null,
  };
  private listeners = new Set<() => void>();
  private shareSocket: ShareSocket;
  /** `undefined` until set. */
  private presenceLocation: PresenceLocation | undefined;
  private presenceThrottle = new Throttle(
    () => void this.sendPresence(),
    presenceInterval,
  );

  constructor(options: ShareSessionOptions) {
    this.options = options;
    this.snapshot = {
      connectionStatus: "connecting",
      endReason: null,
      versionId: null,
      ownState: currentOwnState(this.ownStateSync),
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map(),
      otherPresences: new Map(),
    };
    this.shareSocket = new ShareSocket(options, {
      onMessage: (serverMessage) => this.receive(serverMessage),
      onDisconnected: () => {
        this.updateOwnStateSync({ type: "disconnected" });
        // The others' presences are sent again on joining.
        this.update({
          connectionStatus: "connecting",
          otherPresences: new Map(),
        });
      },
      onEnded: (endReason) =>
        this.update({ connectionStatus: "ended", endReason }),
    });
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): ShareSessionSnapshot => this.snapshot;

  dispatch(action: ParticipantStateAction): void {
    this.updateOwnStateSync({ type: "actionDispatched", action });
    void this.sendNextWrite();
  }

  setPresence(presenceLocation: PresenceLocation): void {
    this.presenceLocation = presenceLocation;
    this.presenceThrottle.request();
  }

  close(): void {
    this.presenceThrottle.cancel();
    this.shareSocket.close();
  }

  private async receive(serverMessage: ServerMessage): Promise<void> {
    const { shareKey, shareId, participantId } = this.options;
    switch (serverMessage.type) {
      case "joined": {
        const joined = await decryptJoinedMessage(this.options, serverMessage);
        this.updateOwnStateSync({
          type: "stateReceived",
          revision: joined.ownRevision,
          storedState: joined.ownStoredState,
        });
        this.update({
          connectionStatus: "connected",
          versionId: serverMessage.versionId,
          isNewParticipant:
            joined.ownRevision === 0 &&
            this.ownStateSync.pendingActions.length === 0,
          otherParticipantStates: joined.otherParticipantStates,
          otherPresences: joined.otherPresences,
        });
        this.presenceThrottle.request();
        break;
      }
      case "stateWritten":
        this.updateOwnStateSync({
          type: "writeStored",
          revision: serverMessage.revision,
        });
        break;
      case "stateRejected":
        this.updateOwnStateSync({
          type: "writeRejected",
          revision: serverMessage.revision,
          storedState:
            serverMessage.state === null
              ? null
              : await decryptParticipantState(
                  shareKey,
                  shareId,
                  participantId,
                  serverMessage.state,
                ),
        });
        break;
      case "participantState": {
        const participantState = await decryptParticipantState(
          shareKey,
          shareId,
          serverMessage.participantId,
          serverMessage.state,
        );
        if (serverMessage.participantId === participantId) {
          this.updateOwnStateSync({
            type: "stateReceived",
            revision: serverMessage.revision,
            storedState: participantState,
          });
        } else if (participantState) {
          const otherParticipantStates = new Map(
            this.snapshot.otherParticipantStates,
          );
          otherParticipantStates.set(
            serverMessage.participantId,
            participantState,
          );
          this.update({ otherParticipantStates });
        }
        break;
      }
      case "presence": {
        const presence = await decryptPresence(
          shareKey,
          shareId,
          serverMessage.participantId,
          serverMessage.presence,
        );
        if (presence) {
          const otherPresences = new Map(this.snapshot.otherPresences);
          otherPresences.set(serverMessage.connectionId, {
            participantId: serverMessage.participantId,
            presence,
          });
          this.update({ otherPresences });
        }
        break;
      }
      case "presenceEnded": {
        const otherPresences = new Map(this.snapshot.otherPresences);
        otherPresences.delete(serverMessage.connectionId);
        this.update({ otherPresences });
        break;
      }
      case "reviewVersion":
        this.update({ versionId: serverMessage.versionId });
    }
    await this.sendNextWrite();
  }

  private async sendNextWrite(): Promise<void> {
    const write = nextOwnStateWrite(this.ownStateSync);
    if (!this.shareSocket.isJoined || !write) {
      return;
    }
    const { connectionNumber } = this.shareSocket;
    // Marked as sent before encrypting, so that it is only sent once.
    this.updateOwnStateSync({
      type: "writeSent",
      participantState: write.participantState,
    });
    const { shareKey, shareId, participantId } = this.options;
    const state = await encryptJson(
      shareKey,
      write.participantState,
      shareAdditionalData.participantState(shareId, participantId),
    );
    this.shareSocket.send(connectionNumber, {
      type: "writeState",
      revision: write.revision,
      state,
    });
  }

  private async sendPresence(): Promise<void> {
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

  private updateOwnStateSync(event: OwnStateSyncEvent): void {
    this.ownStateSync = reduceOwnStateSync(this.ownStateSync, event);
    this.update({
      ownState: currentOwnState(this.ownStateSync),
      hasPendingChanges: this.ownStateSync.pendingActions.length > 0,
      isNewParticipant:
        this.snapshot.isNewParticipant &&
        this.ownStateSync.pendingActions.length === 0,
    });
  }

  private update(changes: Partial<ShareSessionSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...changes };
    for (const listener of this.listeners) {
      listener();
    }
  }
}
