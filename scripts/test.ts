import { deepStrictEqual, strictEqual } from "node:assert";
import {
  decodeHTML,
  decodeXML,
  escapeHTML,
  escapeHTMLAttribute,
  encodeHTML,
  escapeXML,
  escapeXMLAttribute,
  encodeXML,
  tryReadXML,
  tryReadHTML,
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

const DECODABLE_TEXT = "&#x3c; &#60; &lt; hello&#x1F600; &amp; &AMP; &AMP &amp";
strictEqual(decodeHTML(DECODABLE_TEXT), "< < < hello😀 & & & &");
strictEqual(decodeXML(DECODABLE_TEXT), "< < < hello😀 & &AMP; &AMP &amp");

const E_1 = "";
const E_2 = "a";
const E_3 = "am";
const E_4 = "amp";
const E_5 = "amp;";
deepStrictEqual(tryReadXML(E_1), { type: "keep-going" });
deepStrictEqual(tryReadXML(E_2), { type: "keep-going" });
deepStrictEqual(tryReadXML(E_3), { type: "keep-going" });
deepStrictEqual(tryReadXML(E_4), { type: "keep-going" });
deepStrictEqual(tryReadXML(E_5), { type: "read", content: "&", consumed: 4 });
deepStrictEqual(tryReadHTML(E_1), { type: "keep-going" });
deepStrictEqual(tryReadHTML(E_2), { type: "keep-going" });
deepStrictEqual(tryReadHTML(E_3), { type: "keep-going" });
deepStrictEqual(tryReadHTML(E_4), { type: "keep-going" });
deepStrictEqual(tryReadHTML(E_5), { type: "read", content: "&", consumed: 4 });
deepStrictEqual(tryReadHTML(E_4 + " "), {
  type: "read",
  content: "&",
  consumed: 3,
});
