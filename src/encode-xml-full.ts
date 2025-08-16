// Aggressive: encode everything normally escaped in XML and all non-ASCII.

import { escapeXMLAttribute } from "./encode-xml-escape.ts";
import { getEntity } from "./encoding-basic.ts";

const MATCHER = /[^\u0000-\u007F]/gu; // Encode codepoints.

// Use like entities' encodeXML
export const encodeXML = (text: string): string =>
  escapeXMLAttribute(text).replace(MATCHER, getEntity);
