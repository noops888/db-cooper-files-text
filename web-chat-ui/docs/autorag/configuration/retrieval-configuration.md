1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [Retrieval configuration](/autorag/configuration/retrieval-configuration/)
   

# Retrieval configuration

Copy Page

AutoRAG allows you to configure how content is retrieved from your vector index and used to generate a final response. Two options control this behavior:

* **Match threshold**: Minimum similarity score required for a vector match to be considered relevant.
* **Maximum number of results**: Maximum number of top-matching results to return (`top_k`).

AutoRAG uses the [`query()`](/vectorize/best-practices/query-vectors/) method from [Vectorize](/vectorize/) to perform semantic search. This function compares the embedded query vector against the stored vectors in your index and returns the most similar results.

## Match threshold

The `match_threshold` sets the minimum similarity score (for example, cosine similarity) that a document chunk must meet to be included in the results. Threshold values range from `0` to `1`.

* A higher threshold means stricter filtering, returning only highly similar matches.
* A lower threshold allows broader matches, increasing recall but possibly reducing precision.

## Maximum number of results

This setting controls the number of top-matching chunks returned by Vectorize after filtering by similarity score. It corresponds to the `topK` parameter in `query()`. The maximum allowed value is 50.

* Use a higher value if you want to synthesize across multiple documents. However, providing more input to the model can increase latency and cost.
* Use a lower value if you prefer concise answers with minimal context.

## How they work together

AutoRAG's retrieval step follows this sequence:

1. Your query is embedded using the configured Workers AI model.
2. `query()` is called to search the Vectorize index, with `topK` set to the `maximum_number_of_results`.
3. Results are filtered using the `match_threshold`.
4. The filtered results are passed into the generation step as context.

If no results meet the threshold, AutoRAG will not generate a response.

## Configuration

These values can be configured at the AutoRAG instance level or overridden on a per-request basis using the [REST API](/autorag/usage/rest-api/) or the [Workers Binding](/autorag/usage/workers-binding/).

Use the parameters `match_threshold` and `max_num_results` to customize retrieval behavior per request.
