1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [Similarity cache](/autorag/configuration/cache/)
   

# Similarity cache

Copy Page

Similarity-based caching in AutoRAG lets you serve responses from Cloudflareâs cache for queries that are similar to previous requests, rather than creating new, unique responses for every request. This speeds up response times and cuts costs by reusing answers for questions that are close in meaning.

## How It Works

Unlike with basic caching, which creates a new response with every request, this is what happens when a request is received using similarity-based caching:

1. AutoRAG checks if a *similar* prompt (based on your chosen threshold) has been answered before.
2. If a match is found, it returns the cached response instantly.
3. If no match is found, it generates a new response and caches it.

To see if a response came from the cache, check the `cf-aig-cache-status` header: `HIT` for cached and `MISS` for new.

## What to consider when using similarity cache

Consider these behaviors when using similarity caching:

* **Volatile Cache**: If two similar requests hit at the same time, the first might not cache in time for the second to use it, resulting in a `MISS`.
* **30-Day Cache**: Cached responses last 30 days, then expire automatically. No custom durations for now.
* **Data Dependency**: Cached responses are tied to specific document chunks. If those chunks change or get deleted, the cache clears to keep answers fresh.

## How similarity matching works

AutoRAGâs similarity cache uses **MinHash and Locality-Sensitive Hashing (LSH)** to find and reuse responses for prompts that are worded similarly.

Hereâs how it works when a new prompt comes in:

1. The prompt is split into small overlapping chunks of words (called shingles), like âwhatâs theâ or âthe weather.â
2. These shingles are turned into a âfingerprintâ using MinHash. The more overlap two prompts have, the more similar their fingerprints will be.
3. Fingerprints are placed into LSH buckets, which help AutoRAG quickly find similar prompts without comparing every single one.
4. If a past prompt in the same bucket is similar enough (based on your configured threshold), AutoRAG reuses its cached response.

## Choosing a threshold

The similarity threshold decides how close two prompts need to be to reuse a cached response. Here are the available thresholds:

| Threshold | Description | Example Match |
| --- | --- | --- |
| Exact | Near-identical matches only | "Whatâs the weather like today?" matches with "What is the weather like today?" |
| Strong (default) | High semantic similarity | "Whatâs the weather like today?" matches with "Howâs the weather today?" |
| Broad | Moderate match, more hits | "Whatâs the weather like today?" matches with "Tell me todayâs weather" |
| Loose | Low similarity, max reuse | "Whatâs the weather like today?" matches with "Give me the forecast" |

Test these values to see which works best with your [RAG application](/autorag/).
