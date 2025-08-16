import { encodeMap } from "./resources/map.ts";
import { getEntity } from "./encoding-basic.ts";

// Aggressive: find all codepoints or entities that aren't alphanumeric/space.
// Goes faster than [^] and /u, thanks @mdevils
const MATCHER =
  /.[\u0300-\u036F]|[\x01-\x1f\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g;

// Use like entities' encodeHTML
export const encodeHTML = (text: string): string =>
  text.replace(MATCHER, (match) => encodeMap[match] || getEntity(match));
