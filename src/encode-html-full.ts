// Aggressive: encode everything that isn't alphanumeric or space.

import { encodeMap } from "./resources/map.ts";
import { getEntity } from "./encoding-basic.ts";

const MATCHER = /[^A-Za-z0-9 ]\p{M}?|\u205f\u200a/gu;
// Use like entities' encodeHTML
export const encodeHTML = (text: string): string =>
  text.replace(MATCHER, (match) => encodeMap[match] || getEntity(match));
