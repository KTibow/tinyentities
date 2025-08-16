import { getValue } from "./decoding-basic.ts";
import { decodeMap } from "./resources/map.ts";

type TryReadResult =
  | { type: "keep-going" }
  | { type: "read"; content: string; consumed: number }
  | { type: "fail" };

const matchEntity = (text: string) => {
  // In the future replace this with something native?
  const match = text.match(
    /^&[a-z][a-z0-9]+;|^&#x[0-9a-f]+;|^&#[0-9]+;|^&[a-z][a-z0-9]+(?=[^a-z0-9;])/i,
  );
  if (match) {
    return match[0];
  }
};
const keepGoingRegex =
  /^&$|^&#$|^&#x$|^&#x[0-9a-f]+$|^&#[0-9]+$|^&[a-z]$|^&[a-z][a-z0-9]+$/i;
export const tryReadHTML = (text: string): TryReadResult => {
  const entity = matchEntity(text);
  if (entity) {
    let value = getValue(entity);
    value ||= decodeMap[entity];
    if (value) return { type: "read", content: value, consumed: entity.length };
  } else if (keepGoingRegex.test(text)) {
    return { type: "keep-going" };
  }
  return { type: "fail" };
};
export const tryReadXML = (text: string): TryReadResult => {
  const entity = matchEntity(text);
  if (entity) {
    let value = getValue(entity);
    if (!value && entity == "&amp;") value = "&";
    if (!value && entity == "&lt;") value = "<";
    if (!value && entity == "&gt;") value = ">";
    if (!value && entity == "&quot;") value = '"';
    if (!value && entity == "&apos;") value = "'";
    if (value) return { type: "read", content: value, consumed: entity.length };
  } else if (keepGoingRegex.test(text)) {
    return { type: "keep-going" };
  }
  return { type: "fail" };
};
