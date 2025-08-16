# tinyentities

Encoding and decoding HTML entities shouldn't be half of your bundle size. Unfortunately, it's that way with some other libraries. Not with tinyentities.

## Benchmarks
### escapeHTML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   157b /   128 gz | 0.00ms | 0.011ms |
| entities |   339b /   263 gz | 0.001ms | 0.013ms |
| html-entities | 28538b / 13146 gz | 1.3ms | 0.02ms |

### escapeHTMLAttribute
> [!NOTE]
> tinyentities serializes &lt; and &gt; here for [safety](https://developer.chrome.com/blog/escape-attributes),
> making it slower.

| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   192b /   145 gz | 0.00ms | 0.016ms |
| entities |   328b /   259 gz | 0.00ms | 0.007ms |
| html-entities | 28538b / 13146 gz | 1.3ms | 0.021ms |

### escapeXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   129b /   117 gz | 0.00ms | 0.009ms |
| entities |   587b /   401 gz | 0.00ms | 0.038ms |
| html-entities | 28550b / 13150 gz | 1.3ms | 0.021ms |

### escapeXMLAttribute
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   189b /   143 gz | 0.00ms | 0.02ms |
| entities |   587b /   401 gz | 0.00ms | 0.037ms |
| html-entities | 28550b / 13150 gz | 1.3ms | 0.021ms |

### encodeHTML
> [!NOTE]
> Other libraries have separate entity maps for encoding and decoding.
> If you're doing both, tinyentities will be smaller and not duplicate mappings.
> But if you only encode, like in this example, tinyentities will be slightly larger.

| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities | 18039b /  7790 gz | 0.41ms | 0.096ms |
| entities | 24127b /  6396 gz | 0.083ms | 0.046ms |
| html-entities | 28535b / 13148 gz | 1.3ms | 0.048ms |

### encodeXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   280b /   210 gz | 0.00ms | 0.059ms |
| entities |   587b /   401 gz | 0.00ms | 0.037ms |
| html-entities | 28547b / 13153 gz | 1.3ms | 0.05ms |

### decodeHTML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities | 18180b /  7793 gz | 0.48ms | 0.095ms |
| entities | 32153b / 20480 gz | 0.43ms | 0.11ms |
| html-entities | 28343b / 13252 gz | 1.3ms | 0.13ms |

### decodeXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   429b /   256 gz | 0.00ms | 0.058ms |
| entities |  5563b /  1998 gz | 0.006ms | 0.053ms |
| html-entities | 28357b / 13259 gz | 1.3ms | 0.071ms |

## Credit to
[entities](https://github.com/fb55/entities) for showing the power of deltas in compression
