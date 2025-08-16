import { decodeMap } from "./resources/map.ts";
import { getChar } from "./decoding-basic.ts";

const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;|&[A-Za-z][A-Za-z0-9]+;?/g;

export const decodeHTML = (text: string): string =>
  text.replace(
    MATCHER,
    (match) => getChar(match) || decodeMap.get(match) || match,
  );
