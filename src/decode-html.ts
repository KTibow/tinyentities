import { decodeMap } from "./resources/map.ts";

const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;|&[a-z][a-z0-9]+;?/gi;

export const decodeHTML = (text: string): string =>
  text.replace(MATCHER, (match) => {
    if (match[1] == "#") {
      if (match[2] == "x" || match[2] == "X") {
        const code = parseInt(match.slice(3, -1), 16);
        return String.fromCodePoint(code);
      } else {
        const code = parseInt(match.slice(2, -1));
        return String.fromCodePoint(code);
      }
    } else {
      return decodeMap[match.slice(1)] || match;
    }
  });
