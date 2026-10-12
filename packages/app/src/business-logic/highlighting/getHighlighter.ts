import { createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighterPromise: Promise<Highlighter> | null = null;

/** The shared Shiki highlighter. Languages are loaded on demand. */
export default function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}
