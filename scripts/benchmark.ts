import { encodeHTML, encodeXML } from "../src/index.ts";
import { rolldown } from "rolldown";

let seed = 42;
const getRandom = () => {
  seed += 1;
  return Math.sin(seed * 10000) * 0.5 + 1;
};
const randomRaw = Array.from({ length: 1000 }, () => {
  const random = getRandom();
  if (random < 0.8)
    return "abcdefghijklmnopqrstuvwxyz"[Math.floor(random * 2 * 26)];
  if (random < 0.9)
    return `<script>alert("There's been an injection")</script>`;
  const remainingRandomness = (random - 0.9) * 10;
  return String.fromCharCode(Math.floor(2 ** (remainingRandomness * 20)));
}).join("");
const randomHTML = encodeHTML(randomRaw);
const randomXML = encodeXML(randomRaw);

const benchmarks = {
  escapeHTML: {
    tinyentities: `import { escapeHTML } from "./src/index.ts";
globalThis.benchmarkResult = escapeHTML(__INPUT__);`,
    entities: `import { escapeText } from "entities";
globalThis.benchmarkResult = escapeText(__INPUT__);`,
    "html-entities": `import { encode } from "html-entities";
globalThis.benchmarkResult = encode(__INPUT__, { mode: "specialChars" });`,
  },
  escapeHTMLAttribute: {
    tinyentities: `import { escapeHTMLAttribute } from "./src/index.ts";
globalThis.benchmarkResult = escapeHTMLAttribute(__INPUT__);`,
    entities: `import { escapeAttribute } from "entities";
globalThis.benchmarkResult = escapeAttribute(__INPUT__);`,
    "html-entities": `import { encode } from "html-entities";
globalThis.benchmarkResult = encode(__INPUT__, { mode: "specialChars" });`,
  },
  escapeXML: {
    tinyentities: `import { escapeXML } from "./src/index.ts";
globalThis.benchmarkResult = escapeXML(__INPUT__);`,
    entities: `import { encodeXML } from "entities";
globalThis.benchmarkResult = encodeXML(__INPUT__);`,
    "html-entities": `import { encode } from "html-entities";
globalThis.benchmarkResult = encode(__INPUT__, { mode: "specialChars", level: "xml" });`,
  },
  escapeXMLAttribute: {
    tinyentities: `import { escapeXMLAttribute } from "./src/index.ts";
globalThis.benchmarkResult = escapeXMLAttribute(__INPUT__);`,
    entities: `import { encodeXML } from "entities";
globalThis.benchmarkResult = encodeXML(__INPUT__);`,
    "html-entities": `import { encode } from "html-entities";
globalThis.benchmarkResult = encode(__INPUT__, { mode: "specialChars", level: "xml" });`,
  },
  encodeHTML: {
    tinyentities: `import { encodeHTML } from "./src/index.ts";
globalThis.benchmarkResult = encodeHTML(__INPUT__);`,
    entities: `import { encodeHTML } from "entities";
globalThis.benchmarkResult = encodeHTML(__INPUT__);`,
    "html-entities": `import { encode } from "html-entities";
globalThis.benchmarkResult = encode(__INPUT__, { mode: "nonAsciiPrintable" });`,
  },
  encodeXML: {
    tinyentities: `import { encodeXML } from "./src/index.ts";
globalThis.benchmarkResult = encodeXML(__INPUT__);`,
    entities: `import { encodeXML } from "entities";
globalThis.benchmarkResult = encodeXML(__INPUT__);`,
    "html-entities": `import { encode } from "html-entities";
globalThis.benchmarkResult = encode(__INPUT__, { level: "xml" });`,
  },
  decodeHTML: {
    tinyentities: `import { decodeHTML } from "./src/index.ts";
globalThis.benchmarkResult = decodeHTML(__INPUT__);`,
    entities: `import { decodeHTML } from "entities";
globalThis.benchmarkResult = decodeHTML(__INPUT__);`,
    "html-entities": `import { decode } from "html-entities";
globalThis.benchmarkResult = decode(__INPUT__);`,
  },
  decodeXML: {
    tinyentities: `import { decodeXML } from "./src/index.ts";
globalThis.benchmarkResult = decodeXML(__INPUT__);`,
    entities: `import { decodeXML } from "entities";
globalThis.benchmarkResult = decodeXML(__INPUT__);`,
    "html-entities": `import { decode } from "html-entities";
globalThis.benchmarkResult = decode(__INPUT__, { level: "xml" });`,
  },
};

async function gzipCompress(data: string): Promise<Uint8Array> {
  const stream = new CompressionStream("gzip");
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();

  writer.write(new TextEncoder().encode(data));
  writer.close();

  const chunks: Uint8Array[] = [];
  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) chunks.push(value);
  }

  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

const onlyFn = process.argv[2];
for (const [fn, implementations] of Object.entries(benchmarks)) {
  if (onlyFn && fn != onlyFn) continue;

  const kind = {
    escapeHTML: "raw",
    escapeHTMLAttribute: "raw",
    encodeHTML: "raw",
    escapeXML: "raw",
    escapeXMLAttribute: "raw",
    encodeXML: "raw",
    decodeHTML: "html",
    decodeXML: "xml",
  }[fn];
  const payload =
    kind == "html" ? randomHTML : kind == "xml" ? randomXML : randomRaw;

  console.log(`### ${fn}`);
  if (fn == "escapeHTMLAttribute") {
    console.log("> [!NOTE]");
    console.log(
      "> tinyentities serializes &lt; and &gt; here for [safety](https://developer.chrome.com/blog/escape-attributes),",
    );
    console.log("> making it slower.");
    console.log();
  }
  if (fn == "encodeHTML") {
    console.log("> [!NOTE]");
    console.log(
      "> Other libraries have separate entity maps for encoding and decoding.",
    );
    console.log(
      "> If you're doing both, tinyentities will be smaller and not duplicate mappings.",
    );
    console.log(
      "> But if you only encode, like in this example, tinyentities will be slightly larger.",
    );
    console.log();
  }
  console.log(`| Implementation | Size | Speed (avg sampled) |`);
  console.log(`| --- | --- | --- |`);

  for (const [source, code] of Object.entries(implementations)) {
    process.stdout.write(`| ${source} `);

    const virtualInputName = `virtual-${source}.ts`;
    const bundle = await rolldown({
      input: virtualInputName,
      plugins: [
        {
          name: "virtual-input",
          resolveId(id: string) {
            if (id == virtualInputName) return id;
            return null;
          },
          load(id: string) {
            if (id == virtualInputName) return code;
            return null;
          },
        },
      ],
    });
    const { output } = await bundle.generate({ format: "iife", minify: true });
    const bundleCode = output[0].code;

    // Measure sizes
    const pad = (n: number) => n.toString().padStart(5, " ");
    const bundleSize = new TextEncoder().encode(bundleCode).length;
    process.stdout.write(`| ${pad(bundleSize)}b`);
    const gzipped = await gzipCompress(bundleCode);
    const gzipSize = gzipped.length;
    process.stdout.write(` / ${pad(gzipSize)} gz `);

    // Measure speed
    const iterations = source == "html-entities" ? 2000 : 5000;
    delete globalThis.benchmarkResult;
    (globalThis as any).__INPUT__ = payload;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      eval(bundleCode);
    }
    const end = performance.now();
    const avgTime = (end - start) / iterations;
    delete (globalThis as any).__INPUT__;

    // Verify result exists
    const result = globalThis.benchmarkResult;
    delete globalThis.benchmarkResult;

    // Log results
    const round = (n: number, precision: number) => +n.toFixed(precision);
    process.stdout.write(
      `| ${avgTime < 0.02 ? round(avgTime, 3) : avgTime.toFixed(2)}ms |\n`,
    );
  }

  console.log();
}
