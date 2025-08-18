# tinyentities

Encoding and decoding HTML entities shouldn't be half of your bundle size. Unfortunately, it's that way with some other libraries. Not with tinyentities.

## Benchmarks
### escapeHTML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   157b /   128 gz | 0.42µs | 2.9ns/b |
| entities |   339b /   263 gz | 0.39µs | 3.1ns/b |
| html-entities | 28538b / 13146 gz | 1,300µs | 5ns/b |

### escapeHTMLAttribute
> [!NOTE]
> tinyentities serializes &lt; and &gt; here for [safety](https://developer.chrome.com/blog/escape-attributes),
> making it slower.

| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   192b /   145 gz | 0.26µs | 4ns/b |
| entities |   328b /   259 gz | 0.36µs | 1.9ns/b |
| html-entities | 28538b / 13146 gz | 1,300µs | 5.1ns/b |

### escapeXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   129b /   117 gz | 0.25µs | 2.4ns/b |
| entities |   587b /   401 gz | 0.42µs | 9.1ns/b |
| html-entities | 28550b / 13150 gz | 1,300µs | 5.2ns/b |

### escapeXMLAttribute
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   189b /   143 gz | 0.24µs | 4.9ns/b |
| entities |   587b /   401 gz | 0.38µs | 9.1ns/b |
| html-entities | 28550b / 13150 gz | 1,300µs | 5.2ns/b |

### encodeHTML
> [!NOTE]
> Other libraries have separate entity maps for encoding and decoding.
> If you're doing both, tinyentities will be smaller and not duplicate mappings.
> But if you only encode, like in this example, tinyentities will be slightly larger.

| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities | 18102b /  7839 gz | 510µs | 13ns/b |
| entities | 24127b /  6396 gz | 84µs | 12ns/b |
| html-entities | 28535b / 13148 gz | 1,300µs | 12ns/b |

### encodeXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   267b /   225 gz | 0.28µs | 9.4ns/b |
| entities |   587b /   401 gz | 0.38µs | 9ns/b |
| html-entities | 28547b / 13153 gz | 1,300µs | 13ns/b |

### decodeHTML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities | 18130b /  7780 gz | 560µs | 9.1ns/b |
| entities | 32153b / 20480 gz | 430µs | 8.6ns/b |
| html-entities | 28343b / 13252 gz | 1,300µs | 11ns/b |

### decodeXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   381b /   245 gz | 0.5µs | 7.4ns/b |
| entities |  5563b /  1998 gz | 9.5µs | 7.4ns/b |
| html-entities | 28357b / 13259 gz | 1,300µs | 10ns/b |

### tryReadHTML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities | 18609b /  8026 gz | 580µs | 15ns/b |
| entities | 31801b / 20314 gz | 440µs | 14ns/b |

### tryReadXML
| Implementation | Size | Initialize (sampled) | Speed (sampled) |
| --- | --- | --- | --- |
| tinyentities |   725b /   438 gz | 0.3µs | 12ns/b |
| entities |  5215b /  1846 gz | 9.1µs | 11ns/b |

## Credit to
[entities](https://github.com/fb55/entities) for showing the power of deltas in compression
[html-entities](https://github.com/mdevils/html-entities) for some awesome regex
