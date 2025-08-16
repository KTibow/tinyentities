import { getValue as getBasicValue } from "./decoding-basic.ts";
import { getValue as getHTMLValue } from "./decoding-html.ts";

const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;|&[a-z][a-z0-9]+;?/gi;

export const decodeHTML = (text: string): string =>
  text.replace(
    MATCHER,
    (match) => getBasicValue(match) || getHTMLValue(match) || match,
  );
