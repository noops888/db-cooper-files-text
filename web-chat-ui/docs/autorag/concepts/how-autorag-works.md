1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Concepts](/autorag/concepts/)
5. [How AutoRAG works](/autorag/concepts/how-autorag-works/)
   

# How AutoRAG works

Copy Page

AutoRAG sets up and manages your RAG pipeline for you. It connects the tools needed for indexing, retrieval, and generation, and keeps everything up to date by syncing with your data with the index regularly. Once set up, AutoRAG indexes your content in the background and responds to queries in real time.

AutoRAG consists of two core processes:

* **Indexing:** An asynchronous background process that monitors your data source for changes and converts your data into vectors for search.
* **Querying:** A synchronous process triggered by user queries. It retrieves the most relevant content and generates context-aware responses.

## How indexing works

Indexing begins automatically when you create an AutoRAG instance and connect a data source.

Here is what happens during indexing:

1. **Data ingestion:** AutoRAG reads from your connected data source.
2. **Markdown conversion:** AutoRAG uses [Workers AIâs Markdown Conversion](/workers-ai/features/markdown-conversion/) to convert [supported data types](/autorag/configuration/data-source/) into structured Markdown. This ensures consistency across diverse file types. For images, Workers AI is used to perform object detection followed by vision-to-language transformation to convert images into Markdown text.
3. **Chunking:** The extracted text is [chunked](/autorag/configuration/chunking/) into smaller pieces to improve retrieval granularity.
4. **Embedding:** Each chunk is embedded using Workers AIâs embedding model to transform the content into vectors.
5. **Vector storage:** The resulting vectors, along with metadata like file name, are stored in a the [Vectorize](/vectorize/) database created on your Cloudflare account.

After the initial data set is indexed, AutoRAG will regularly check for updates in your data source (e.g. additions, updates, or deletes) and index changes to ensure your vector database is up to date.

![Indexing](/_astro/indexing.CQ13F9Js_1Pewmk.webp)

## How querying works

Once indexing is complete, AutoRAG is ready to respond to end-user queries in real time.

Here is how the querying pipeline works:

1. **Receive query from AutoRAG API:** The query workflow begins when you send a request to either the AutoRAGâs [AI Search](/autorag/usage/rest-api/#ai-search) or [Search](/autorag/usage/rest-api/#search) endpoints.
2. **Query rewriting (optional):** AutoRAG provides the option to [rewrite the input query](/autorag/configuration/query-rewriting/) using one of Workers AIâs LLMs to improve retrieval quality by transforming the original query into a more effective search query.
3. **Embedding the query:** The rewritten (or original) query is transformed into a vector via the same embedding model used to embed your data so that it can be compared against your vectorized data to find the most relevant matches.
4. **Querying Vectorize index:** The query vector is [queried](/vectorize/best-practices/query-vectors/) against stored vectors in the associated Vectorize database for your AutoRAG.
5. **Content retrieval:** Vectorize returns the metadata of the most relevant chunks, and the original content is retrieved from the R2 bucket. If you are using the Search endpoint, the content is returned at this point.
6. **Response generation:** If you are using the AI Search endpoint, then a text-generation model from Workers AI is used to generate a response using the retrieved content and the original userâs query, combined via a [system prompt](/autorag/configuration/system-prompt/). The context-aware response from the model is returned.

![Querying](/_astro/querying.c_RrR1YL_Z1CePPB.webp)
