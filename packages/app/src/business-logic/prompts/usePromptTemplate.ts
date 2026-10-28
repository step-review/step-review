import useStoredText from "../storage/useStoredText.ts";
import createStartPrompt from "./createStartPrompt.ts";
import promptTemplateStorageKey from "./promptTemplateStorageKey.ts";

/**
 * The prompt the user starts from, customized and remembered in this browser,
 * along with the default one.
 */
export default function usePromptTemplate() {
  const defaultPromptTemplate = createStartPrompt(window.location.origin);
  const [promptTemplate, setPromptTemplate] = useStoredText(
    promptTemplateStorageKey,
    defaultPromptTemplate,
  );
  return { promptTemplate, setPromptTemplate, defaultPromptTemplate };
}
