import { shareCloseCodes } from "@step-review/share-server";
import type ShareEndReason from "./ShareEndReason.ts";

/** The socket close codes after which reconnecting is pointless. */
export default new Map<number, ShareEndReason>([
  [shareCloseCodes.invalidMessage, "failed"],
  [shareCloseCodes.forbidden, "forbidden"],
  [shareCloseCodes.shareNotFound, "notFound"],
  [shareCloseCodes.tooManyParticipants, "tooManyParticipants"],
]);
