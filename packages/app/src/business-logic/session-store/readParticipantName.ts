import randomParticipantName from "../session-participants/randomParticipantName.ts";
import readStorage from "../storage/readStorage.ts";
import writeStorage from "../storage/writeStorage.ts";
import participantNameStorageKey from "./participantNameStorageKey.ts";

/**
 * The name last used in a session, or else a random one, kept so that it is
 * used again in the next session.
 */
export default function readParticipantName(): string {
  const storedName = readStorage(participantNameStorageKey);
  if (storedName !== null) {
    return storedName;
  }
  const name = randomParticipantName();
  writeStorage(participantNameStorageKey, name);
  return name;
}
