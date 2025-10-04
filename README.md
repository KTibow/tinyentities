# tinyentities

Encoding and decoding HTML entities shouldn't be half of your bundle size. Unfortunately, it's that way with some other libraries. Not with tinyentities.

<details>
<summary><h2>Usage</h2></summary>

```js
import {
  decodeHTML,
  decodeXML,
  escapeHTML, // Use like entities' escapeText
  escapeHTMLAttribute, // Use like entities' escapeAttribute
  encodeHTML,
  escapeXML,
  escapeXMLAttribute, // Use like entities' escapeUTF8
  encodeXML,
  tryReadHTML, // Use when you would use entities' EntityDecoder
  tryReadXML, // Use when you would use entities' EntityDecoder
} from "tinyentities";

console.log(decodeHTML("&lt;hi&gt;")); // <hi>
console.log(decodeXML("&lt;hi&gt;")); // <hi>

console.log(escapeHTML("<hi>")); // &lt;hi&gt;
console.log(escapeHTMLAttribute("<hi>")); // &lt;hi&gt;
console.log(encodeHTML("<hi>")); // &lt;hi&gt;

console.log(escapeXML("<hi>")); // &lt;hi&gt;
console.log(escapeXMLAttribute("<hi>")); // &lt;hi&gt;
console.log(encodeXML("<hi>")); // &lt;hi&gt;

// An example of how you might wrap tryReadHTML / tryReadXML in a TransformStream:
// (will log <hi>)
const createStreamingEntityDecoder = (useXML) => {
  const read = useXML ? tryReadXML : tryReadHTML;
  let pending = "";
  return new TransformStream({
    transform(text, controller) {
      text = pending + text;
      pending = "";

      let start = 0; // start of the current segment to process

      for (let i = 0; i < text.length; i++) {
        if (text[i] != "&") continue;

        // Emit everything before "&" immediately
        if (i > start) {
          controller.enqueue(text.slice(start, i));
        }

        // Evaluate what's after "&"
        const afterAmp = text.slice(i + 1);
        const result = read(afterAmp);

        if (result.type == "keep-going") {
          // We might have an entity, but need more data. Hold from "&".
          pending = text.slice(i);
          return; // This chunk is finished
        } else if (result.type == "read") {
          // Emit the decoded entity
          controller.enqueue(result.content);

          // Advance past the entire entity: "&" + consumed
          const nextIndex = i + 1 + result.consumed;
          i = nextIndex - 1; // -1 because the loop will i++ next
          start = nextIndex;
        } else {
          // fail: not a valid entity; emit literal "&" and continue
          controller.enqueue("&");
          start = i + 1;
        }
      }

      // Emit any remaining text after the last processed segment
      if (start < text.length) {
        controller.enqueue(text.slice(start));
      }
    },

    flush(controller) {
      // If stream ends with an incomplete entity, emit it as-is
      if (pending) controller.enqueue(pending);
    },
  });
};
const stream = new Response(`&lt;hi&gt;`).body;
const textDecoder = new TextDecoderStream();
const entityDecoder = createStreamingEntityDecoder(false);
for await (const chunk of stream
  .pipeThrough(textDecoder)
  .pipeThrough(entityDecoder)) {
  process.stdout.write(chunk);
}
```

</details>

## Benchmarks

### escapeHTML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   157b /   128 gz | 0.5µs                | 3ns/b           |
| entities       |   339b /   263 gz | 0.52µs               | 3.1ns/b         |
| html-entities  | 28538b / 13146 gz | 1,400µs              | 5.4ns/b         |

### escapeHTMLAttribute

> [!NOTE]
> tinyentities serializes &lt; and &gt; here for [safety](https://developer.chrome.com/blog/escape-attributes),
> making it slower.

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   192b /   145 gz | 0.3µs                | 4ns/b           |
| entities       |   328b /   259 gz | 0.51µs               | 1.8ns/b         |
| html-entities  | 28538b / 13146 gz | 1,300µs              | 5.4ns/b         |

### escapeXML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   129b /   117 gz | 0.29µs               | 2.4ns/b         |
| entities       |   636b /   423 gz | 0.62µs               | 5ns/b           |
| html-entities  | 28550b / 13150 gz | 1,400µs              | 5.8ns/b         |

### escapeXMLAttribute

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   189b /   143 gz | 0.31µs               | 5ns/b           |
| entities       |   636b /   423 gz | 0.52µs               | 5.1ns/b         |
| html-entities  | 28550b / 13150 gz | 1,400µs              | 5.7ns/b         |

### encodeHTML

> [!NOTE]
> Other libraries have separate entity maps for encoding and decoding.
> If you're doing both, tinyentities will be smaller and not duplicate mappings.
> But if you only encode, like in this example, tinyentities will be slightly larger.

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   | 18177b /  7757 gz | 560µs                | 13ns/b          |
| entities       | 14456b /  6247 gz | 130µs                | 6.6ns/b         |
| html-entities  | 28535b / 13148 gz | 1,400µs              | 13ns/b          |

### encodeXML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   267b /   225 gz | 0.51µs               | 9.9ns/b         |
| entities       |   636b /   423 gz | 0.53µs               | 5ns/b           |
| html-entities  | 28547b / 13153 gz | 1,400µs              | 13ns/b          |

### decodeHTML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   | 18205b /  7699 gz | 590µs                | 8.9ns/b         |
| entities       | 38623b / 22198 gz | 48µs                 | 7.1ns/b         |
| html-entities  | 28343b / 13252 gz | 1,400µs              | 11ns/b          |

### decodeXML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   381b /   245 gz | 0.32µs               | 7.7ns/b         |
| entities       |  6483b /  2223 gz | 7.9µs                | 5.9ns/b         |
| html-entities  | 28357b / 13259 gz | 1,400µs              | 9.8ns/b         |

### tryReadHTML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   | 18681b /  7940 gz | 570µs                | 14ns/b          |
| entities       | 38277b / 22008 gz | 48µs                 | 12ns/b          |

### tryReadXML

| Implementation | Size              | Initialize (sampled) | Speed (sampled) |
| -------------- | ----------------- | -------------------- | --------------- |
| tinyentities   |   725b /   438 gz | 0.32µs               | 9.9ns/b         |
| entities       |  6141b /  2073 gz | 8.3µs                | 10ns/b          |

## Credit to

[entities](https://github.com/fb55/entities) for showing the power of deltas in compression

[html-entities](https://github.com/mdevils/html-entities) for some awesome regex
