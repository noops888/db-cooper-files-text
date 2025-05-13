1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [Query rewriting](/autorag/configuration/query-rewriting/)
   

# Query rewriting

Copy Page

Query rewriting is an optional step in the AutoRAG pipeline that improves retrieval quality by transforming the original user query into a more effective search query.

Instead of embedding the raw user input directly, AutoRAG can use a large language model (LLM) to rewrite the query based on a system prompt. The rewritten query is then used to perform the vector search.

## Why use query rewriting?

The wording of a userâs question may not match how your documents are written. Query rewriting helps bridge this gap by:

* Rephrasing informal or vague queries into precise, information-dense terms
* Adding synonyms or related keywords
* Removing filler words or irrelevant details
* Incorporating domain-specific terminology

This leads to more relevant vector matches which improves the accuracy of the final generated response.

## Example

**Original query:** `how do i make this work when my api call keeps failing?`

**Rewritten query:** `API call failure troubleshooting authentication headers rate limiting network timeout 500 error`

In this example, the original query is conversational and vague. The rewritten version extracts the core problem (API call failure) and expands it with relevant technical terms and likely causes. These terms are much more likely to appear in documentation or logs, improving semantic matching during vector search.

## How it works

If query rewriting is enabled, AutoRAG performs the following:

1. Sends the **original user query** and the **query rewrite system prompt** to the configured LLM
2. Receives the **rewritten query** from the model
3. Embeds the rewritten query using the selected embedding model
4. Performs vector search in your AutoRAGâs Vectorize index

For details on how to guide model behavior during this step, see the [system prompt](/autorag/configuration/system-prompt/) documentation.
