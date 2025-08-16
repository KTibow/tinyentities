import { strictEqual } from "node:assert";
import {
  escapeHTML,
  escapeHTMLAttribute,
  encodeHTML,
  escapeXML,
  escapeXMLAttribute,
  encodeXML,
} from "./src/index.ts";

const BASE_TEST = `&<>"'\u00a0`;
strictEqual(escapeHTML(BASE_TEST), `&amp;&lt;&gt;"'&nbsp;`);
strictEqual(escapeHTMLAttribute(BASE_TEST), `&amp;&lt;&gt;&quot;'&nbsp;`);
strictEqual(encodeHTML(BASE_TEST), `&amp;&lt;&gt;&quot;&apos;&nbsp;`);
strictEqual(escapeXML(BASE_TEST), `&amp;&lt;&gt;"'\u00a0`);
strictEqual(escapeXMLAttribute(BASE_TEST), `&amp;&lt;&gt;&quot;&apos;\u00a0`);
strictEqual(encodeXML(BASE_TEST), `&amp;&lt;&gt;&quot;&apos;&#xa0;`);

// 1 byte, length 1, 1 codepoint, codepoints that combine
const ENTITY_TEST = `° Δ 𝔡 ≂̸`;
strictEqual(encodeHTML(ENTITY_TEST), `&deg; &Delta; &dfr; &nesim;`);
strictEqual(encodeXML(ENTITY_TEST), `&#xb0; &#x394; &#x1d521; &#x2242;&#x338;`);
