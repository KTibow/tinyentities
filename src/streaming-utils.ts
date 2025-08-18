import { decodeMap } from "./resources/map.ts";

type TryReadResult =
  | { type: "keep-going" }
  | { type: "read"; content: string; consumed: number }
  | { type: "fail" };

const extMatchRegex = /^[a-z][a-z0-9]+(?=[^a-z0-9;])/i;
const keepGoingRegex = /^$|^[a-z]$|^[a-z][a-z0-9]{1,29}$/i;

// Drop & before calling
const numericParse = (text: string, strict: boolean): TryReadResult => {
  const useHex = text[1] == "x" || text[1] == "X";
  let code = 0;
  for (let index = useHex ? 2 : 1; index < text.length; index++) {
    const c = text[index];
    if (c == ";") {
      return {
        type: "read",
        content: String.fromCodePoint(code),
        consumed: index + 1,
      };
    }
    const n = parseInt(c, useHex ? 16 : 10);
    if (Number.isNaN(n)) {
      return strict
        ? { type: "fail" }
        : {
            type: "read",
            content: String.fromCodePoint(code),
            consumed: index,
          };
    }
    code = code * (useHex ? 16 : 10) + n;
  }
  return { type: "keep-going" };
};
// Drop & before calling
export const tryReadHTML = (text: string): TryReadResult => {
  if (text[0] == "#") return numericParse(text, false);

  const semicolon = text.indexOf(";");
  let extMatch: string | undefined;
  if (semicolon > -1) {
    // Optimized route: there is a normal entity
    const value = decodeMap[text.slice(0, semicolon + 1)];
    return value
      ? { type: "read", content: value, consumed: semicolon + 1 }
      : { type: "fail" };
  } else if ((extMatch = text.match(extMatchRegex)?.[0])) {
    // Ends with non-semicolon
    const value = decodeMap[extMatch];
    return value
      ? { type: "read", content: value, consumed: extMatch.length }
      : { type: "fail" };
  } else if (keepGoingRegex.test(text)) {
    return { type: "keep-going" };
  } else {
    return { type: "fail" };
  }
};
export const tryReadXML = (text: string): TryReadResult => {
  if (text[0] == "#") return numericParse(text, true);

  const semicolon = text.indexOf(";");
  if (semicolon > -1) {
    // Optimized route: there is a normal entity
    const entityName = text.slice(0, semicolon);
    const value =
      entityName == "amp"
        ? "&"
        : entityName == "lt"
          ? "<"
          : entityName == "gt"
            ? ">"
            : entityName == "quot"
              ? '"'
              : entityName == "apos"
                ? "'"
                : undefined;
    return value
      ? { type: "read", content: value, consumed: semicolon + 1 }
      : { type: "fail" };
  } else if (keepGoingRegex.test(text)) {
    return { type: "keep-going" };
  } else {
    return { type: "fail" };
  }
};
