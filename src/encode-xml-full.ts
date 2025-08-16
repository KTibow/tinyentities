import { getEntity } from "./encoding-basic.ts";

// Aggressive: find all codepoints that are normally escaped in XML or aren't ASCII.
// Goes faster than [^] and /u, thanks @mdevils
const MATCHER =
  /[&<>"'\x7f-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g;

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
