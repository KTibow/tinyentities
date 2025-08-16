import { strictEqual } from "node:assert";
import {
  decodeHTML,
  decodeXML,
  escapeHTML,
  escapeHTMLAttribute,
  encodeHTML,
  escapeXML,
  escapeXMLAttribute,
  encodeXML,
} from "../src/index.ts";

const ESCAPABLE_TEXT = `&<>"'\u00a0`;
strictEqual(escapeHTML(ESCAPABLE_TEXT), `&amp;&lt;&gt;"'&nbsp;`);
strictEqual(escapeHTMLAttribute(ESCAPABLE_TEXT), `&amp;&lt;&gt;&quot;'&nbsp;`);
strictEqual(encodeHTML(ESCAPABLE_TEXT), `&amp;&lt;&gt;&quot;&apos;&nbsp;`);
strictEqual(escapeXML(ESCAPABLE_TEXT), `&amp;&lt;&gt;"'\u00a0`);
strictEqual(
  escapeXMLAttribute(ESCAPABLE_TEXT),
  `&amp;&lt;&gt;&quot;&apos;\u00a0`,
);
strictEqual(encodeXML(ESCAPABLE_TEXT), `&amp;&lt;&gt;&quot;&apos;&#xa0;`);

// 1 byte, length 1, 1 codepoint, codepoints that combine
const UNICODE_TEXT = `° Δ 𝔡 ≂̸`;
strictEqual(encodeHTML(UNICODE_TEXT), `&deg; &Delta; &dfr; &nesim;`);
strictEqual(
  encodeXML(UNICODE_TEXT),
  `&#xb0; &#x394; &#x1d521; &#x2242;&#x338;`,
);

const DECODABLE_TEXT = "&#x3c; &#60; &lt; hello &amp; &AMP; &AMP &amp";
strictEqual(decodeHTML(DECODABLE_TEXT), "< < < hello & & & &");
strictEqual(decodeXML(DECODABLE_TEXT), "< < < hello & &AMP; &AMP &amp");
