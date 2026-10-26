import { sessionLimits, type ServerMessage } from "@step-review/session-server";
import currentOwnState from "../participant-state/currentOwnState.ts";
import emptyOwnStateSync from "../participant-state/emptyOwnStateSync.ts";
import mergeViewedMarks from "../participant-state/mergeViewedMarks.ts";
import nextOwnStateWrite from "../participant-state/nextOwnStateWrite.ts";
import type OwnStateSyncEvent from "../participant-state/OwnStateSyncEvent.ts";
import type ParticipantStateAction from "../participant-state/ParticipantStateAction.ts";
import reduceOwnStateSync from "../participant-state/reduceOwnStateSync.ts";
import viewedMarksForAction from "../participant-state/viewedMarksForAction.ts";
import type ReviewStateAction from "../review-state/ReviewStateAction.ts";
import encryptJson from "../session-crypto/encryptJson.ts";
import sessionAdditionalData from "../session-crypto/sessionAdditionalData.ts";
import decryptJoinedMessage from "./decryptJoinedMessage.ts";
import decryptParticipantState from "./decryptParticipantState.ts";
import decryptPresence from "./decryptPresence.ts";
import type PresenceLocation from "./PresenceLocation.ts";
import PresenceSender from "./PresenceSender.ts";
import type SessionConnectionOptions from "./SessionConnectionOptions.ts";
import type SessionConnectionSnapshot from "./SessionConnectionSnapshot.ts";
import SessionSocket from "./SessionSocket.ts";

/**
 * A live connection to a session: keeps the own state stored, and the others'
 * states and presences up to date.
 */
export default class SessionConnection {
  private options: SessionConnectionOptions;
  private snapshot: SessionConnectionSnapshot;
  private ownStateSync = emptyOwnStateSync();
  private listeners = new Set<() => void>();
  private sessionSocket: SessionSocket;
  private presenceSender: PresenceSender;

  constructor(options: SessionConnectionOptions) {
    this.options = options;
    this.snapshot = {
      connectionStatus: "connecting",
      endReason: null,
      ownState: currentOwnState(this.ownStateSync),
      hasPendingChanges: false,
      isNewParticipant: false,
      otherParticipantStates: new Map(),
      fileViewedStatuses: new Map(),
      otherPresences: new Map(),
    };
    this.sessionSocket = new SessionSocket(options, {
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
    this.presenceSender = new PresenceSender(options, this.sessionSocket);
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): SessionConnectionSnapshot => this.snapshot;

  /** Changes the review's state, for every participant. */
  dispatch(reviewStateAction: ReviewStateAction): void {
    this.apply({
      type: "addViewedMarks",
      viewedMarks: viewedMarksForAction(
        reviewStateAction,
        this.snapshot.fileViewedStatuses,
        Date.now(),
      ),
    });
  }

  rename(name: string): void {
    this.apply({ type: "rename", name });
  }

  setPresence(presenceLocation: PresenceLocation): void {
    this.presenceSender.set(presenceLocation);
  }

  close(): void {
    this.presenceSender.cancel();
    this.sessionSocket.close();
  }

  private apply(action: ParticipantStateAction): void {
    this.updateOwnStateSync({ type: "actionDispatched", action });
    void this.sendNextWrite();
  }

  private async receive(serverMessage: ServerMessage): Promise<void> {
    const { sessionKey, sessionId, participantId } = this.options;
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
          isNewParticipant:
            joined.ownRevision === 0 &&
            this.ownStateSync.pendingActions.length === 0,
          otherParticipantStates: joined.otherParticipantStates,
          otherPresences: joined.otherPresences,
        });
        this.presenceSender.resend();
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
                  sessionKey,
                  sessionId,
                  participantId,
                  serverMessage.state,
                ),
        });
        break;
      case "participantState": {
        const participantState = await decryptParticipantState(
          sessionKey,
          sessionId,
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
          sessionKey,
          sessionId,
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
      }
    }
    await this.sendNextWrite();
  }

  private async sendNextWrite(): Promise<void> {
    const write = nextOwnStateWrite(this.ownStateSync);
    if (!this.sessionSocket.isJoined || !write) {
      return;
    }
    const { connectionNumber } = this.sessionSocket;
    // Marked as sent before encrypting, so that it is only sent once.
    this.updateOwnStateSync({
      type: "writeSent",
      participantState: write.participantState,
    });
    const { sessionKey, sessionId, participantId } = this.options;
    const state = await encryptJson(
      sessionKey,
      write.participantState,
      sessionAdditionalData.participantState(sessionId, participantId),
    );
    // The server would close the socket for it, and reconnecting would send it
    // again.
    if (state.length > sessionLimits.maxStateLength) {
      this.presenceSender.cancel();
      this.sessionSocket.end("stateTooLarge");
      return;
    }
    this.sessionSocket.send(connectionNumber, {
      type: "writeState",
      revision: write.revision,
      state,
    });
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

  private update(changes: Partial<SessionConnectionSnapshot>): void {
    const { ownState } = this.snapshot;
    this.snapshot = { ...this.snapshot, ...changes };
    if (this.snapshot.ownState !== ownState || changes.otherParticipantStates) {
      this.snapshot.fileViewedStatuses = mergeViewedMarks([
        [this.options.participantId, this.snapshot.ownState],
        ...this.snapshot.otherParticipantStates,
      ]);
    }
    for (const listener of this.listeners) {
      listener();
    }
  }
}
