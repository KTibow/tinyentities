// To escape just enough to not have XML problems.

export const escapeXML = (text: string): string =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// Use like entities' escapeUTF8
export const escapeXMLAttribute = (text: string): string =>
  escapeXML(text).replaceAll('"', "&quot;").replaceAll("'", "&apos;");
