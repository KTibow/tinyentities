const MATCHER = /&#x[0-9a-f]+;|&#[0-9]+;/gi;

export const decodeXML = (text: string): string =>
  text
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replace(MATCHER, (match) => {
      if (match[2] == "x" || match[2] == "X") {
        const code = parseInt(match.slice(3, -1), 16);
        return String.fromCodePoint(code);
      } else {
        const code = parseInt(match.slice(2, -1));
        return String.fromCodePoint(code);
      }
    })
    .replaceAll("&amp;", "&");
