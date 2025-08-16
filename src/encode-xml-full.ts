// Aggressive: encode everything normally escaped in XML and all non-ASCII.

import { getEntity } from "./encoding-basic.ts";

const MATCHER = /[&<>"']|[^\u0000-\u007F]/gu;

// Use like entities' encodeXML
export const encodeXML = (text: string): string =>
  text.replace(MATCHER, (char) => {
    if (char == "&") return "&amp;";
    if (char == "<") return "&lt;";
    if (char == ">") return "&gt;";
    if (char == '"') return "&quot;";
    if (char == "'") return "&apos;";
    return getEntity(char);
  });
