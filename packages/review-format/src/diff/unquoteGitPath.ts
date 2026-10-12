const simpleEscapes: Record<string, number> = {
  a: 7,
  b: 8,
  t: 9,
  n: 10,
  v: 11,
  f: 12,
  r: 13,
  '"': 34,
  "\\": 92,
};

/**
 * Decodes a path as git prints it: either verbatim, or in double quotes with
 * C-style escapes (octal escapes are UTF-8 bytes).
 */
export default function unquoteGitPath(path: string): string {
  if (!path.startsWith('"') || !path.endsWith('"') || path.length < 2) {
    return path;
  }
  const bytes: number[] = [];
  const encoder = new TextEncoder();
  const quoted = path.slice(1, -1);
  for (let index = 0; index < quoted.length; index++) {
    const character = quoted[index]!;
    if (character !== "\\") {
      bytes.push(...encoder.encode(character));
      continue;
    }
    const octal = /^[0-7]{3}/u.exec(quoted.slice(index + 1));
    if (octal) {
      bytes.push(Number.parseInt(octal[0], 8));
      index += 3;
      continue;
    }
    const escaped = quoted[index + 1] ?? "";
    bytes.push(simpleEscapes[escaped] ?? escaped.charCodeAt(0));
    index += 1;
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}
