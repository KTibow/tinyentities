# tinyentities

Encoding and decoding HTML entities shouldn't be half of your bundle size. Unfortunately, it's that way with some other libraries. Not with tinyentities.

## Benchmarks
### escapeHTML
| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities |   165b /   136 gz | 0.012ms |
| entities |   347b /   269 gz | 0.014ms |
| html-entities | 28546b / 13151 gz | 1.23ms |

### escapeHTMLAttribute
> [!NOTE]
> tinyentities serializes &lt; and &gt; here for [safety](https://developer.chrome.com/blog/escape-attributes),
> making it slower.

| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities |   200b /   151 gz | 0.016ms |
| entities |   336b /   266 gz | 0.008ms |
| html-entities | 28546b / 13151 gz | 1.24ms |

### escapeXML
| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities |   137b /   125 gz | 0.01ms |
| entities |   595b /   408 gz | 0.04ms |
| html-entities | 28558b / 13155 gz | 1.22ms |

### escapeXMLAttribute
| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities |   197b /   149 gz | 0.02ms |
| entities |   595b /   408 gz | 0.04ms |
| html-entities | 28558b / 13155 gz | 1.23ms |

### encodeHTML
> [!NOTE]
> Other libraries have separate entity maps for encoding and decoding.
> If you're doing both, tinyentities will be smaller and not duplicate mappings.
> But if you only encode, like in this example, tinyentities will be slightly larger.

| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities | 18150b /  7843 gz | 0.45ms |
| entities | 24135b /  6400 gz | 0.12ms |
| html-entities | 28551b / 13154 gz | 1.26ms |

### encodeXML
| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities |   288b /   216 gz | 0.06ms |
| entities |   595b /   408 gz | 0.04ms |
| html-entities | 28538b / 13155 gz | 1.24ms |

### decodeHTML
| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities | 18180b /  7790 gz | 0.51ms |
| entities | 32161b / 20486 gz | 0.72ms |
| html-entities | 28351b / 13257 gz | 1.38ms |

### decodeXML
| Implementation | Size | Speed (avg sampled) |
| --- | --- | --- |
| tinyentities |   437b /   262 gz | 0.05ms |
| entities |  5571b /  2004 gz | 0.16ms |
| html-entities | 28365b / 13264 gz | 1.30ms |

## Credit to
[entities](https://github.com/fb55/entities) for showing the power of deltas in compression
