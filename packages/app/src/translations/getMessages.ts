import type { MessageFormatElement } from "react-intl";
import englishMessages from "./compiled/en.json";

export default function getMessages() {
  return englishMessages as Record<string, MessageFormatElement[]>;
}
