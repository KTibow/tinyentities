import { getChar as getBasicChar } from "./decoding-basic.ts";
import { getChar as getHTMLChar } from "./decoding-html.ts";

const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;|&[A-Za-z][A-Za-z0-9]+;?/g;

export const decodeHTML = (text: string): string =>
  text.replace(
    MATCHER,
    (match) => getBasicChar(match) || getHTMLChar(match) || match,
  );
