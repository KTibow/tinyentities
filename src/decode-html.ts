import { getChar as getBasicChar } from "./decoding-basic.ts";
import { getChar as getHTMLChar } from "./decoding-html.ts";

const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;|&[a-z][a-z0-9]+;?/gi;

export const decodeHTML = (text: string): string =>
  text.replace(
    MATCHER,
    (match) => getBasicChar(match) || getHTMLChar(match) || match,
  );
