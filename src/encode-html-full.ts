// Aggressive: encode everything that isn't alphanumeric or space.

import { getEntity as getBasicEntity } from "./encoding-basic.ts";
import { encodeMap } from "./resources/map.ts";

const MATCHER = /[^A-Za-z0-9 ]\p{M}?|\u205f\u200a/gu;
export const encodeHTML = (text: string): string =>
  text.replace(MATCHER, (match) => {
    return encodeMap.get(match) || getBasicEntity(match);
  });
