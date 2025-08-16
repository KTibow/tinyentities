import { getValue } from "./decoding-basic.ts";

const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;/gi;

export const decodeXML = (text: string): string =>
  text
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replace(MATCHER, (match) => getValue(match)!)
    .replaceAll("&amp;", "&");
