import type FileViewedStatus from "./FileViewedStatus.ts";
import type ParticipantState from "./ParticipantState.ts";
import type ViewedMark from "./ViewedMark.ts";

interface ParticipantViewedMark extends ViewedMark {
  participantId: string;
}

/**
 * The viewed status of each file of a session, by fingerprint: the file's
 * latest mark wins. Marks made at the same time are ordered by participant ID,
 * so that every participant gets the same statuses.
 */
export default function mergeViewedMarks(
  participantStates: Iterable<[participantId: string, ParticipantState]>,
): Map<string, FileViewedStatus> {
  const viewedMarksByFingerprint = new Map<
    string,
    Map<string, ParticipantViewedMark>
  >();
  for (const [participantId, participantState] of participantStates) {
    for (const viewedMark of participantState.viewedMarks) {
      const participantViewedMarks =
        viewedMarksByFingerprint.get(viewedMark.fingerprint) ??
        new Map<string, ParticipantViewedMark>();
      // Other participants wrote their states, which may mark a file twice.
      const currentViewedMark = participantViewedMarks.get(participantId);
      if (!currentViewedMark || viewedMark.at > currentViewedMark.at) {
        participantViewedMarks.set(participantId, {
          ...viewedMark,
          participantId,
        });
      }
      viewedMarksByFingerprint.set(
        viewedMark.fingerprint,
        participantViewedMarks,
      );
    }
  }
  const fileViewedStatuses = new Map<string, FileViewedStatus>();
  for (const [
    fingerprint,
    participantViewedMarks,
  ] of viewedMarksByFingerprint) {
    const viewedMarks = [...participantViewedMarks.values()];
    const latestViewedMark = viewedMarks.reduce(later);
    const latestUnviewedMark = viewedMarks
      .filter((viewedMark) => !viewedMark.viewed)
      .reduce<ParticipantViewedMark | null>(
        (latest, viewedMark) =>
          latest ? later(latest, viewedMark) : viewedMark,
        null,
      );
    fileViewedStatuses.set(fingerprint, {
      viewed: latestViewedMark.viewed,
      at: latestViewedMark.at,
      viewerIds: viewedMarks
        .filter(
          (viewedMark) =>
            viewedMark.viewed &&
            (!latestUnviewedMark ||
              later(viewedMark, latestUnviewedMark) === viewedMark),
        )
        .map((viewedMark) => viewedMark.participantId),
    });
  }
  return fileViewedStatuses;
}

function later(
  first: ParticipantViewedMark,
  second: ParticipantViewedMark,
): ParticipantViewedMark {
  return first.at > second.at ||
    (first.at === second.at && first.participantId > second.participantId)
    ? first
    : second;
}
