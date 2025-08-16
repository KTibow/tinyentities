// To escape just enough to not have HTML problems.

// Use like entities' escapeText
export const escapeHTML = (text: string): string =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\u00a0", "&nbsp;");

// Use like entities' escapeAttribute
export const escapeHTMLAttribute = (text: string): string =>
  escapeHTML(text).replaceAll('"', "&quot;");
