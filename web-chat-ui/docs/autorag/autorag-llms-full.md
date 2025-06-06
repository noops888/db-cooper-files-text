# Getting started

URL: https://developers.cloudflare.com/autorag/get-started/

AutoRAG allows developers to create fully managed retrieval-augmented generation (RAG) pipelines to power AI applications with accurate and up-to-date information without needing to manage infrastructure.

## 1. Upload data or use existing data in R2

AutoRAG integrates with R2 for data import. Create an R2 bucket if you do not have one and upload your data.

:::note
Before you create your first bucket, you must purchase R2 from the Cloudflare dashboard.
:::

To create and upload objects to your bucket from the Cloudflare dashboard:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/r2) and select **R2**.
2. Select Create bucket, name the bucket, and select **Create bucket**.
3. Choose to either drag and drop your file into the upload area or **select from computer**. Review the [file limits](/autorag/configuration/data-source/) when creating your knowledge base.

_If you need inspiration for what document to use to make your first AutoRAG, try downloading and uploading the [RSS](/changelog/rss/index.xml) of the [Cloudflare Changelog](/changelog/)._

## 2. Create an AutoRAG

To create a new AutoRAG:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/ai/autorag) and select **AI** > **AutoRAG**.
2. Select **Create AutoRAG**, configure the AutoRAG, and complete the setup process.
3. Select **Create**.

## 3. Monitor indexing

Once created, AutoRAG will create a Vectorize index in your account and begin indexing the data.

To monitor the indexing progress:

1. From the **AutoRAG** page in the dashboard, locate and select your AutoRAG.
2. Navigate to the **Overview** page to view the current indexing status.

## 4. Try it out

Once indexing is complete, you can run your first query:

1. From the **AutoRAG** page in the dashboard, locate and select your AutoRAG.
2. Navigate to the **Playground** page.
3. Select **Search with AI** or **Search**.
4. Enter a **query** to test out its response.

## 5. Add to your application

There are multiple ways you can create [RAG applications](/autorag/) with Cloudflare AutoRAG:

- [Workers Binding](/autorag/usage/workers-binding/)
- [REST API](/autorag/usage/rest-api/)

---

# Overview

URL: https://developers.cloudflare.com/autorag/

import {
	CardGrid,
	Description,
	LinkTitleCard,
	Plan,
	RelatedProduct,
	LinkButton,
	Feature,
} from "~/components";

<Description>
	Create fully-managed RAG applications that continuously update and scale on Cloudflare.
</Description>

<Plan type="all" />

AutoRAG lets you create retrieval-augmented generation (RAG) pipelines that power your AI applications with accurate and up-to-date information. Create RAG applications that integrate context-aware AI without managing infrastructure.

You can use AutoRAG to build:

- **Product Chatbot:** Answer customer questions using your own product content.
- **Docs Search:** Make documentation easy to search and use.

<div>
	<LinkButton href="/autorag/get-started">Get started</LinkButton>
	<LinkButton
		target="_blank"
		variant="secondary"
		icon="external"
		href="https://www.youtube.com/watch?v=JUFdbkiDN2U"
	>
		Watch AutoRAG demo
	</LinkButton>
</div>

---

## Features

<Feature header="Automated indexing" href="/autorag/configuration/indexing/" cta="View indexing">

Automatically and continuously index your data source, keeping your content fresh without manual reprocessing.

</Feature>

<Feature header="Multitenancy support" href="/autorag/how-to/multitenancy/" cta="Add filters">

Create multitenancy by scoping search to each tenantâ€™s data using folder-based metadata filters.

</Feature>

<Feature header="Workers Binding" href="/autorag/usage/workers-binding/" cta="Add to Worker">

Call your AutoRAG instance for search or AI Search directly from a Cloudflare Worker using the native binding integration.

</Feature>

<Feature header="Similarity caching" href="/autorag/configuration/cache/" cta="Use caching">

Cache repeated queries and results to improve latency and reduce compute on repeated requests.

</Feature>

---

## Related products

<RelatedProduct header="Workers AI" href="/workers-ai/" product="workers-ai">

Run machine learning models, powered by serverless GPUs, on Cloudflareâ€™s global network.

</RelatedProduct>

<RelatedProduct header="AI Gateway" href="/ai-gateway/" product="ai-gateway">

Observe and control your AI applications with caching, rate limiting, request retries, model fallback, and more.

</RelatedProduct>

<RelatedProduct header="Vectorize" href="/vectorize/" product="vectorize">

Build full-stack AI applications with Vectorize, Cloudflareâ€™s vector database.

</RelatedProduct>

<RelatedProduct header="Workers" href="/workers/" product="workers">

Build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

</RelatedProduct>

<RelatedProduct header="R2" href="/r2/" product="r2">

Store large amounts of unstructured data without the costly egress bandwidth fees associated with typical cloud storage services.

</RelatedProduct>

---

## More resources

<CardGrid>

<LinkTitleCard
	title="Get started"
	href="/workers-ai/get-started/workers-wrangler/"
	icon="open-book"
>
	Build and deploy your first Workers AI application.
</LinkTitleCard>

<LinkTitleCard
	title="Developer Discord"
	href="https://discord.cloudflare.com"
	icon="discord"
>
	Connect with the Workers community on Discord to ask questions, share what you
	are building, and discuss the platform with other developers.
</LinkTitleCard>

<LinkTitleCard
	title="@CloudflareDev"
	href="https://x.com/cloudflaredev"
	icon="x.com"
>
	Follow @CloudflareDev on Twitter to learn about product announcements, and
	what is new in Cloudflare Workers.
</LinkTitleCard>

</CardGrid>

---

# How AutoRAG works

URL: https://developers.cloudflare.com/autorag/concepts/how-autorag-works/

AutoRAG sets up and manages your RAG pipeline for you. It connects the tools needed for indexing, retrieval, and generation, and keeps everything up to date by syncing with your data with the index regularly. Once set up, AutoRAG indexes your content in the background and responds to queries in real time.

AutoRAG consists of two core processes:

- **Indexing:** An asynchronous background process that monitors your data source for changes and converts your data into vectors for search.
- **Querying:** A synchronous process triggered by user queries. It retrieves the most relevant content and generates context-aware responses.

## How indexing works

Indexing begins automatically when you create an AutoRAG instance and connect a data source.

Here is what happens during indexing:

1. **Data ingestion:** AutoRAG reads from your connected data source.
2. **Markdown conversion:** AutoRAG uses [Workers AIâ€™s Markdown Conversion](/workers-ai/features/markdown-conversion/) to convert [supported data types](/autorag/configuration/data-source/) into structured Markdown. This ensures consistency across diverse file types. For images, Workers AI is used to perform object detection followed by vision-to-language transformation to convert images into Markdown text.
3. **Chunking:** The extracted text is [chunked](/autorag/configuration/chunking/) into smaller pieces to improve retrieval granularity.
4. **Embedding:** Each chunk is embedded using Workers AIâ€™s embedding model to transform the content into vectors.
5. **Vector storage:** The resulting vectors, along with metadata like file name, are stored in a the [Vectorize](/vectorize/) database created on your Cloudflare account.

After the initial data set is indexed, AutoRAG will regularly check for updates in your data source (e.g. additions, updates, or deletes) and index changes to ensure your vector database is up to date.

![Indexing](~/assets/images/autorag/indexing.png)

## How querying works

Once indexing is complete, AutoRAG is ready to respond to end-user queries in real time.

Here is how the querying pipeline works:

1. **Receive query from AutoRAG API:** The query workflow begins when you send a request to either the AutoRAGâ€™s [AI Search](/autorag/usage/rest-api/#ai-search) or [Search](/autorag/usage/rest-api/#search) endpoints.
2. **Query rewriting (optional):** AutoRAG provides the option to [rewrite the input query](/autorag/configuration/query-rewriting/) using one of Workers AIâ€™s LLMs to improve retrieval quality by transforming the original query into a more effective search query.
3. **Embedding the query:** The rewritten (or original) query is transformed into a vector via the same embedding model used to embed your data so that it can be compared against your vectorized data to find the most relevant matches.
4. **Querying Vectorize index:** The query vector is [queried](/vectorize/best-practices/query-vectors/) against stored vectors in the associated Vectorize database for your AutoRAG.
5. **Content retrieval:** Vectorize returns the metadata of the most relevant chunks, and the original content is retrieved from the R2 bucket. If you are using the Search endpoint, the content is returned at this point.
6. **Response generation:** If you are using the AI Search endpoint, then a text-generation model from Workers AI is used to generate a response using the retrieved content and the original userâ€™s query, combined via a [system prompt](/autorag/configuration/system-prompt/). The context-aware response from the model is returned.

![Querying](~/assets/images/autorag/querying.png)

---

# Concepts

URL: https://developers.cloudflare.com/autorag/concepts/

import { DirectoryListing } from "~/components";

<DirectoryListing />

---

# What is RAG

URL: https://developers.cloudflare.com/autorag/concepts/what-is-rag/

Retrieval-Augmented Generation (RAG) is a way to use your own data with a large language model (LLM). Instead of relying only on what the model was trained on, RAG searches for relevant information from your data source and uses it to help answer questions.

## How RAG works

Hereâ€™s a simplified overview of the RAG pipeline:

1. **Indexing:** Your content (e.g. docs, wikis, product information) is split into smaller chunks and converted into vectors using an embedding model. These vectors are stored in a vector database.
2. **Retrieval:** When a user asks a question, itâ€™s also embedded into a vector and used to find the most relevant chunks from the vector database.
3. **Generation:** The retrieved content and the userâ€™s original question are combined into a single prompt. An LLM uses that prompt to generate a response.

The resulting response should be accurate, relevant, and based on your own data.

![What is RAG](~/assets/images/autorag/RAG.png)

:::note[How does AutoRAG work]
To learn more details about how AutoRAG uses RAG under the hood, reference [How AutoRAG works](/autorag/concepts/how-autorag-works/).
:::

## Why use RAG?

RAG lets you bring your own data into LLM generation without retraining or fine-tuning a model. It improves both accuracy and trust by retrieving relevant content at query time and using that as the basis for a response.

Benefits of using RAG:

- **Accurate and current answers:** Responses are based on your latest content, not outdated training data.
- **Control over information sources:** You define the knowledge base so answers come from content you trust.
- **Fewer hallucinations:** Responses are grounded in real, retrieved data, reducing made-up or misleading answers.
- **No model training required:** You can get high-quality results without building or fine-tuning your own LLM which can be time consuming and costly.

RAG is ideal for building AI-powered apps like:

- AI assistants for internal knowledge
- Support chatbots connected to your latest content
- Enterprise search across documentation and files

---

# Similarity cache

URL: https://developers.cloudflare.com/autorag/configuration/cache/

Similarity-based caching in AutoRAG lets you serve responses from Cloudflareâ€™s cache for queries that are similar to previous requests, rather than creating new, unique responses for every request. This speeds up response times and cuts costs by reusing answers for questions that are close in meaning.

## How It Works

Unlike with basic caching, which creates a new response with every request, this is what happens when a request is received using similarity-based caching:

1. AutoRAG checks if a _similar_ prompt (based on your chosen threshold) has been answered before.
2. If a match is found, it returns the cached response instantly.
3. If no match is found, it generates a new response and caches it.

To see if a response came from the cache, check the `cf-aig-cache-status` header: `HIT` for cached and `MISS` for new.

## What to consider when using similarity cache

Consider these behaviors when using similarity caching:

- **Volatile Cache**: If two similar requests hit at the same time, the first might not cache in time for the second to use it, resulting in a `MISS`.
- **30-Day Cache**: Cached responses last 30 days, then expire automatically. No custom durations for now.
- **Data Dependency**: Cached responses are tied to specific document chunks. If those chunks change or get deleted, the cache clears to keep answers fresh.

## How similarity matching works

AutoRAGâ€™s similarity cache uses **MinHash and Locality-Sensitive Hashing (LSH)** to find and reuse responses for prompts that are worded similarly.

Hereâ€™s how it works when a new prompt comes in:

1. The prompt is split into small overlapping chunks of words (called shingles), like â€œwhatâ€™s theâ€ or â€œthe weather.â€
2. These shingles are turned into a â€œfingerprintâ€ using MinHash. The more overlap two prompts have, the more similar their fingerprints will be.
3. Fingerprints are placed into LSH buckets, which help AutoRAG quickly find similar prompts without comparing every single one.
4. If a past prompt in the same bucket is similar enough (based on your configured threshold), AutoRAG reuses its cached response.

## Choosing a threshold

The similarity threshold decides how close two prompts need to be to reuse a cached response. Here are the available thresholds:

| Threshold        | Description                 | Example Match                                                                   |
| ---------------- | --------------------------- | ------------------------------------------------------------------------------- |
| Exact            | Near-identical matches only | "Whatâ€™s the weather like today?" matches with "What is the weather like today?" |
| Strong (default) | High semantic similarity    | "Whatâ€™s the weather like today?" matches with "Howâ€™s the weather today?"        |
| Broad            | Moderate match, more hits   | "Whatâ€™s the weather like today?" matches with "Tell me todayâ€™s weather"         |
| Loose            | Low similarity, max reuse   | "Whatâ€™s the weather like today?" matches with "Give me the forecast"            |

Test these values to see which works best with your [RAG application](/autorag/).

---

# Data source

URL: https://developers.cloudflare.com/autorag/configuration/data-source/

import { Render } from "~/components";

AutoRAG currently supports Cloudflare R2 as the data source for storing your knowledge base. To get started, [configure an R2 bucket](/r2/get-started/) containing your data.

AutoRAG will automatically scan and process supported files stored in that bucket. Files that are unsupported or exceed the size limit will be skipped during indexing and logged as errors.

## File limits

AutoRAG has different file size limits depending on the file type:

- **Plain text files:** Up to **4â€¯MB**
- **Rich format files:** Up to **1â€¯MB**

Files that exceed these limits will not be indexed and will show up in the error logs.

## File types

AutoRAG can ingest a variety of different file types to power your RAG. The following plain text files and rich format files are supported.

### Plain text file types

AutoRAG supports the following plain text file types:

| Format     | File extensions                                                                | Mime Type                                                             |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Text       | `.txt`                                                                         | `text/plain`                                                          |
| Log        | `.log`                                                                         | `text/plain`                                                          |
| Config     | `.ini`, `.conf`, `.env`, `.properties`, `.gitignore`, `.editorconfig`, `.toml` | `text/plain`, `text/toml`                                             |
| Markdown   | `.markdown`, `.md`, `.mdx`                                                     | `text/markdown`                                                       |
| LaTeX      | `.tex`, `.latex`                                                               | `application/x-tex`, `application/x-latex`                            |
| Script     | `.sh`, `.bat` , `.ps1`                                                         | `application/x-sh` , `application/x-msdos-batch`, `text/x-powershell` |
| SGML       | `.sgml`                                                                        | `text/sgml`                                                           |
| JSON       | `.json`                                                                        | `application/json`                                                    |
| YAML       | `.yaml`, `.yml`                                                                | `application/x-yaml`                                                  |
| CSS        | `.css`                                                                         | `text/css`                                                            |
| JavaScript | `.js`                                                                          | `application/javascript`                                              |
| PHP        | `.php`                                                                         | `application/x-httpd-php`                                             |
| Python     | `.py`                                                                          | `text/x-python`                                                       |
| Ruby       | `.rb`                                                                          | `text/x-ruby`                                                         |
| Java       | `.java`                                                                        | `text/x-java-source`                                                  |
| C          | `.c`                                                                           | `text/x-c`                                                            |
| C++        | `.cpp`, `.cxx`                                                                 | `text/x-c++`                                                          |
| C Header   | `.h`, `.hpp`                                                                   | `text/x-c-header`                                                     |
| Go         | `.go`                                                                          | `text/x-go`                                                           |
| Rust       | `.rs`                                                                          | `text/rust`                                                           |
| Swift      | `.swift`                                                                       | `text/swift`                                                          |
| Dart       | `.dart`                                                                        | `text/dart`                                                           |

### Rich format file types

AutoRAG uses [Markdown Conversion](/workers-ai/features/markdown-conversion/) to convert rich format files to markdown. The following table lists the supported formats that will be converted to Markdown:

<Render file="markdown-conversion-support" product="workers-ai" />

---

# Chunking

URL: https://developers.cloudflare.com/autorag/configuration/chunking/

Chunking is the process of splitting large data into smaller segments before embedding them for search. AutoRAG uses **recursive chunking**, which breaks your content at natural boundaries (like paragraphs or sentences), and then further splits it if the chunks are too large.

## What is recursive chunking

Recursive chunking tries to keep chunks meaningful by:

- **Splitting at natural boundaries:** like paragraphs, then sentences.
- **Checking the size:** if a chunk is too long (based on token count), itâ€™s split again into smaller parts.

This way, chunks are easy to embed and retrieve, without cutting off thoughts mid-sentence.

## Chunking controls

AutoRAG exposes two parameters to help you control chunking behavior:

- **Chunk size**: The number of tokens per chunk.
  - Minimum: `64`
  - Maximum: `512`
- **Chunk overlap**: The percentage of overlapping tokens between adjacent chunks.
  - Minimum: `0%`
  - Maximum: `30%`

These settings apply during the indexing step, before your data is embedded and stored in Vectorize.

## Choosing chunk size and overlap

Chunking affects both how your content is retrieved and how much context is passed into the generation model. Try out this external [chunk visualizer tool](https://huggingface.co/spaces/m-ric/chunk_visualizer) to help understand how different chunk settings could look.

For chunk size, consider how:

- **Smaller chunks** create more precise vector matches, but may split relevant ideas across multiple chunks.
- **Larger chunks** retain more context, but may dilute relevance and reduce retrieval precision.

For chunk overlap, consider how:

- **More overlap** helps preserve continuity across boundaries, especially in flowing or narrative content.
- **Less overlap** reduces indexing time and cost, but can miss context if key terms are split between chunks.

### Additional considerations:

- **Vector index size:** Smaller chunk sizes produce more chunks and more total vectors. Refer to the [Vectorize limits](/vectorize/platform/limits/) to ensure your configuration stays within the maximum allowed vectors per index.
- **Generation model context window:** Generation models have a limited context window that must fit all retrieved chunks (`topK` Ã— `chunk size`), the user query, and the modelâ€™s output. Be careful with large chunks or high topK values to avoid context overflows.
- **Cost and performance:** Larger chunks and higher topK settings result in more tokens passed to the model, which can increase latency and cost. You can monitor this usage in [AI Gateway](/ai-gateway/).

---

# Configuration

URL: https://developers.cloudflare.com/autorag/configuration/

import { MetaInfo, Type } from "~/components";

When creating an AutoRAG instance, you can customize how your RAG pipeline ingests, processes, and responds to data using a set of configuration options. Some settings can be updated after the instance is created, while others are fixed at creation time.

The table below lists all available configuration options:

| Configuration                                                                | Editable after creation | Description                                                                                |
| ---------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| [Data source](/autorag/configuration/data-source/)                           | no                      | The source where your knowledge base is stored                                             |
| [Chunk size](/autorag/configuration/chunking/)                               | yes                     | Number of tokens per chunk                                                                 |
| [Chunk overlap](/autorag/configuration/chunking/)                            | yes                     | Number of overlapping tokens between chunks                                                |
| [Embedding model](/autorag/configuration/models/)                            | no                      | Model used to generate vector embeddings                                                   |
| [Query rewrite](/autorag/configuration/query-rewriting/)                     | yes                     | Enable or disable query rewriting before retrieval                                         |
| [Query rewrite model](/autorag/configuration/models/)                        | yes                     | Model used for query rewriting                                                             |
| [Query rewrite system prompt](/autorag/configuration/system-prompt/)         | yes                     | Custom system prompt to guide query rewriting behavior                                     |
| [Match threshold](/autorag/configuration/retrieval-configuration/)           | yes                     | Minimum similarity score required for a vector match                                       |
| [Maximum number of results](/autorag/configuration/retrieval-configuration/) | yes                     | Maximum number of vector matches returned (`top_k`)                                        |
| [Generation model](/autorag/configuration/models/)                           | yes                     | Model used to generate the final response                                                  |
| [Generation system prompt](/autorag/configuration/system-prompt/)            | yes                     | Custom system prompt to guide response generation                                          |
| [Similarity caching](/autorag/configuration/cache/)                          | yes                     | Enable or disable caching of responses for similar (not just exact) prompts                |
| [Similarity caching threshold](/autorag/configuration/cache/)                | yes                     | Controls how similar a new prompt must be to a previous one to reuse its cached response   |
| [AI Gateway](/ai-gateway)                                                    | yes                     | AI Gateway for monitoring and controlling model usage                                      |
| AutoRAG name                                                                 | no                      | Name of your AutoRAG instance                                                              |
| Service API token                                                            | yes                     | API token granted to AutoRAG to give it permission to configure resources on your account. |

:::note[API token]
The Service API token is different from the AutoRAG API token that you can make to interact with your AutoRAG. The Service API token is only used by AutoRAG to get permissions to configure resources on your account.
:::

---

# Indexing

URL: https://developers.cloudflare.com/autorag/configuration/indexing/

AutoRAG automatically indexes your data into vector embeddings optimized for semantic search. Once a data source is connected, indexing runs continuously in the background to keep your knowledge base fresh and queryable.

## Jobs

AutoRAG automatically monitors your data source for updates and reindexes your content **every 4 hours**. During each cycle, only new or modified files are reprocessed to keep your Vectorize index up to date.

## Controls

You can control indexing behavior through the following actions on the dashboard:

- **Sync Index**: Force AutoRAG to scan your data source for new or modified files and initiate an indexing job to update the associated Vectorize index. A new indexing job can be initiated every 5 minutes.
- **Pause Indexing**: Temporarily stop all scheduled indexing checks and reprocessing. Useful for debugging or freezing your knowledge base.

## Performance

AutoRAG processes files in parallel for efficient indexing. The total time to index depends on the number and type of files in your data source.

Factors that affect performance include:

- Total number of files and their sizes
- File formats (for example, images take longer than plain text)
- Latency of Workers AI models used for embedding and image processing

## Best practices

To ensure smooth and reliable indexing:

- Make sure your files are within the [**size limit**](/autorag/platform/limits-pricing/#limits) and in a supported format to avoid being skipped.
- Keep your Service API token valid to prevent indexing failures.
- Regularly clean up outdated or unnecessary content in your knowledge base to avoid hitting [Vectorize index limits](/vectorize/platform/limits/).

---

# Metadata filtering

URL: https://developers.cloudflare.com/autorag/configuration/metadata-filtering/

Metadata filtering narrows down search results based on metadata, so only relevant content is retrieved. The filter narrows down results prior to retrieval, so that you only query the scope of documents that matter.

Here is an example of metadata filtering using [Workers Binding](/autorag/usage/workers-binding/) but it can be easily adapted to use the [REST API](/autorag/usage/rest-api/) instead.

```js
const answer = await env.AI.autorag("my-autorag").search({
	query: "How do I train a llama to deliver coffee?",
	filters: {
		type: "and",
		filters: [
			{
				type: "eq",
				key: "folder",
				value: "llama/logistics/",
			},
			{
				type: "gte",
				key: "timestamp",
				value: "1735689600000", // unix timestamp for 2025-01-01
			},
		],
	},
});
```

## Metadata attributes

You can currently filter by the `folder` and `timestamp` of an R2 object. Currently, custom metadata attributes are not supported.

### `folder`

The directory to the object. For example, the `folder` of the object at `llama/logistics/llama-logistics.mdx` is `llama/logistics/`. Note that the `folder` does not include a leading `/`.

Note that `folder` filter only includes files exactly in that folder, so files in subdirectories are not included. For example, specifying `folder: "llama/"` will match files in `llama/` but does not match files in `llama/logistics`.

### `timestamp`

The timestamp indicating when the object was last modified. Comparisons are supported using a 13-digit Unix timestamp (milliseconds), but values will be rounded to 10 digits (seconds). For example, `1735689600999` or `2025-01-01 00:00:00.999 UTC` will be rounded down to `1735689600000`, corresponding to `2025-01-01 00:00:00 UTC`.

## Filter schema

You can create simple comparison filters or an array of comparison filters using a compound filter.

### Comparison filter

You can compare a metadata attribute (for example, `folder` or `timestamp`) with a target value using a comparison filter.

```js
filters: {
  type: "operator",
  key: "metadata_attribute",
  value: "target_value"
}
```

The available operators for the comparison are:

| Operator | Description               |
| -------- | ------------------------- |
| `eq`     | Equals                    |
| `ne`     | Not equals                |
| `gt`     | Greater than              |
| `gte`    | Greater than or equals to |
| `lt`     | Less than                 |
| `lte`    | Less than or equals to    |

### Compound filter

You can use a compound filter to combine multiple comparison filters with a logical operator.

```js
filters: {
  type: "compound_operator",
  filters: [...]
}
```

The available compound operators are: `and`, `or`.

Note the following limitations with the compound operators:

- No nesting combinations of `and`'s and `or`'s, meaning you can only pick 1 `and` or 1 `or`.
- When using `or`:
  - Only the `eq` operator is allowed.
  - All conditions must filter on the **same key** (for example, all on `folder`)

## Response

You can see the metadata attributes of your retrieved data in the response under the property `attributes` for each retrieved chunk. For example:

```js
"data": [
  {
    "file_id": "llama001",
    "filename": "llama/logistics/llama-logistics.md",
    "score": 0.45,
    "attributes": {
      "timestamp": 1735689600000,   // unix timestamp for 2025-01-01
      "folder": "llama/logistics/",
    },
    "content": [
      {
        "id": "llama001",
        "type": "text",
        "text": "Llamas can carry 3 drinks max."
      }
    ]
  }
]
```

---

# Models

URL: https://developers.cloudflare.com/autorag/configuration/models/

AutoRAG uses models at multiple steps of the RAG pipeline. You can configure which models are used, or let AutoRAG automatically select defaults optimized for general use.

## Models used

AutoRAG leverages Workers AI models in the following stages:

- **Image to markdown conversion (if images are in data source)**: Converts image content to Markdown using object detection and captioning models.
- **Embedding**: Transforms your documents and queries into vector representations for semantic search.
- **Query rewriting (optional)**: Reformulates the userâ€™s query to improve retrieval accuracy.
- **Generation**: Produces the final response from retrieved context.

## Model providers

AutoRAG currently only supports [Workers AI](/workers-ai/) as the model provider. Usage of models through AutoRAG contributes to your Workers AI usage and is billed as part of your account.

If you have connected your project to [AI Gateway](/ai-gateway), all model calls triggered by AutoRAG can be tracked in AI Gateway. This gives you full visibility into inputs, outputs, latency, and usage patterns.

## Choosing a model

When configuring your AutoRAG instance, you can specify the exact model to use for each step of embedding, rewriting, and generation. You can find available models that can be used with AutoRAG in the **Settings** of your AutoRAG.

:::note
AutoRAG supports a subset of Workers AI models that have been selected to provide the best experience for RAG.
:::

### Smart default

If you choose **Smart Default** in your model selection, then AutoRAG will select a Cloudflare recommended model. These defaults may change over time as Cloudflare evaluates and updates model choices. You can switch to explicit model configuration at any time by visiting **Settings**.

### Per-request generation model override

While the generation model can be set globally at the AutoRAG instance level, you can also override it on a per-request basis in the [AI Search API](/autorag/usage/rest-api/#ai-search). This is useful if your [RAG application](/autorag/) requires dynamic selection of generation models based on context or user preferences.

---

# Query rewriting

URL: https://developers.cloudflare.com/autorag/configuration/query-rewriting/

Query rewriting is an optional step in the AutoRAG pipeline that improves retrieval quality by transforming the original user query into a more effective search query.

Instead of embedding the raw user input directly, AutoRAG can use a large language model (LLM) to rewrite the query based on a system prompt. The rewritten query is then used to perform the vector search.

## Why use query rewriting?

The wording of a userâ€™s question may not match how your documents are written. Query rewriting helps bridge this gap by:

- Rephrasing informal or vague queries into precise, information-dense terms
- Adding synonyms or related keywords
- Removing filler words or irrelevant details
- Incorporating domain-specific terminology

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
4. Performs vector search in your AutoRAGâ€™s Vectorize index

For details on how to guide model behavior during this step, see the [system prompt](/autorag/configuration/system-prompt/) documentation.

---

# Retrieval configuration

URL: https://developers.cloudflare.com/autorag/configuration/retrieval-configuration/

AutoRAG allows you to configure how content is retrieved from your vector index and used to generate a final response. Two options control this behavior:

- **Match threshold**: Minimum similarity score required for a vector match to be considered relevant.
- **Maximum number of results**: Maximum number of top-matching results to return (`top_k`).

AutoRAG uses the [`query()`](/vectorize/best-practices/query-vectors/) method from [Vectorize](/vectorize/) to perform semantic search. This function compares the embedded query vector against the stored vectors in your index and returns the most similar results.

## Match threshold

The `match_threshold` sets the minimum similarity score (for example, cosine similarity) that a document chunk must meet to be included in the results. Threshold values range from `0` to `1`.

- A higher threshold means stricter filtering, returning only highly similar matches.
- A lower threshold allows broader matches, increasing recall but possibly reducing precision.

## Maximum number of results

This setting controls the number of top-matching chunks returned by Vectorize after filtering by similarity score. It corresponds to the `topK` parameter in `query()`. The maximum allowed value is 50.

- Use a higher value if you want to synthesize across multiple documents. However, providing more input to the model can increase latency and cost.
- Use a lower value if you prefer concise answers with minimal context.

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

---

# System prompt

URL: https://developers.cloudflare.com/autorag/configuration/system-prompt/

System prompts allow you to guide the behavior of the text-generation models used by AutoRAG at query time. AutoRAG supports system prompt configuration in two steps:

- **Query rewriting**: Reformulates the original user query to improve semantic retrieval. A system prompt can guide how the model interprets and rewrites the query.
- **Generation**: Generates the final response from retrieved context. A system prompt can help define how the model should format, filter, or prioritize information when constructing the answer.

## What is a system prompt?

A system prompt is a special instruction sent to a large language model (LLM) that guides how it behaves during inference. The system prompt defines the model's role, context, or rules it should follow.

System prompts are particularly useful for:

- Enforcing specific response formats
- Constraining behavior (for example, it only responds based on the provided content)
- Applying domain-specific tone or terminology
- Encouraging consistent, high-quality output

## How to set your system prompt

The system prompt for your AutoRAG can be set after it has been created by:

1. Navigating to the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/ai/autorag), and go to AI > AutoRAG
2. Select your AutoRAG
3. Go to Settings page and find the System prompt setting for either Query rewrite or Generation

### Default system prompt

When configuring your AutoRAG instance, you can provide your own system prompts. If you do not provide a system prompt, AutoRAG will use the **default system prompt** provided by Cloudflare.

You can view the effective system prompt used for any AutoRAG's model call through AI Gateway logs, where model inputs and outputs are recorded.

:::note
The default system prompt can change and evolve over time to improve performance and quality.
:::

## Query rewriting system prompt

If query rewriting is enabled, you can provide a custom system prompt to control how the model rewrites user queries. In this step, the model receives:

- The query rewrite system prompt
- The original user query

The model outputs a rewritten query optimized for semantic retrieval.

### Example

```text
You are a search query optimizer for vector database searches. Your task is to reformulate user queries into more effective search terms.

Given a user's search query, you must:
1. Identify the core concepts and intent
2. Add relevant synonyms and related terms
3. Remove irrelevant filler words
4. Structure the query to emphasize key terms
5. Include technical or domain-specific terminology if applicable

Provide only the optimized search query without any explanations, greetings, or additional commentary.

Example input: "how to fix a bike tire that's gone flat"
Example output: "bicycle tire repair puncture fix patch inflate maintenance flat tire inner tube replacement"

Constraints:
- Output only the enhanced search terms
- Keep focus on searchable concepts
- Include both specific and general related terms
- Maintain all important meaning from original query
```

## Generation system prompt

If you are using the AI Search API endpoint, you can use the system prompt to influence how the LLM responds to the final user query using the retrieved results. At this step, the model receives:

- The user's original query
- Retrieved document chunks (with metadata)
- The generation system prompt

The model uses these inputs to generate a context-aware response.

### Example

```
You are a helpful AI assistant specialized in answering questions using retrieved documents.
Your task is to provide accurate, relevant answers based on the matched content provided.
For each query, you will receive:
User's question/query
A set of matched documents, each containing:
  - File name
  - File content

You should:
1. Analyze the relevance of matched documents
2. Synthesize information from multiple sources when applicable
3. Acknowledge if the available documents don't fully answer the query
4. Format the response in a way that maximizes readability, in Markdown format

Answer only with direct reply to the user question, be concise, omit everything which is not directly relevant, focus on answering the question directly and do not redirect the user to read the content.

If the available documents don't contain enough information to fully answer the query, explicitly state this and provide an answer based on what is available.

Important:
- Cite which document(s) you're drawing information from
- Present information in order of relevance
- If documents contradict each other, note this and explain your reasoning for the chosen answer
- Do not repeat the instructions
```

---

# Bring your own generation model

URL: https://developers.cloudflare.com/autorag/how-to/bring-your-own-generation-model/

import {
	Badge,
	Description,
	Render,
	TabItem,
	Tabs,
	WranglerConfig,
	MetaInfo,
	Type,
} from "~/components";

When using `AI Search`, AutoRAG leverages a Workers AI model to generate the response. If you want to use a model outside of Workers AI, you can use AutoRAG for search while leveraging a model outside of Workers AI to generate responses.

Here is an example of how you can use an OpenAI model to generate your responses. This example uses [Workers Binding](/autorag/usage/workers-binding/), but can be easily adapted to use the [REST API](/autorag/usage/rest-api/) instead.

```ts
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export interface Env {
	AI: Ai;
	OPENAI_API_KEY: string;
}

export default {
	async fetch(request, env): Promise<Response> {
		// Parse incoming url
		const url = new URL(request.url);

		// Get the user query or default to a predefined one
		const userQuery =
			url.searchParams.get("query") ??
			"How do I train a llama to deliver coffee?";

		// Search for documents in AutoRAG
		const searchResult = await env.AI.autorag("my-rag").search({
			query: userQuery,
		});

		if (searchResult.data.length === 0) {
			// No matching documents
			return Response.json({ text: `No data found for query "${userQuery}"` });
		}

		// Join all document chunks into a single string
		const chunks = searchResult.data
			.map((item) => {
				const data = item.content
					.map((content) => {
						return content.text;
					})
					.join("\n\n");

				return `<file name="${item.filename}">${data}</file>`;
			})
			.join("\n\n");

		// Send the user query + matched documents to openai for answer
		const generateResult = await generateText({
			model: openai("gpt-4o-mini"),
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant and your task is to answer the user question using the provided files.",
				},
				{ role: "user", content: chunks },
				{ role: "user", content: userQuery },
			],
		});

		// Return the generated answer
		return Response.json({ text: generateResult.text });
	},
} satisfies ExportedHandler<Env>;
```

---

# How to

URL: https://developers.cloudflare.com/autorag/how-to/

import { DirectoryListing } from "~/components";

<DirectoryListing />

---

# Create multitenancy

URL: https://developers.cloudflare.com/autorag/how-to/multitenancy/

AutoRAG supports multitenancy by letting you segment content by tenant, so each user, customer, or workspace can only access their own data. This is typically done by organizing documents into per-tenant folders and applying [metadata filters](/autorag/configuration/metadata-filtering/) at query time.

## 1. Organize Content by Tenant

When uploading files to R2, structure your content by tenant using unique folder paths.

Example folder structure:

```bash
customer-a/logs/
customer-a/contracts/
customer-b/contracts/
```

When indexing, AutoRAG will automatically store the folder path as metadata under the `folder` attribute. It is recommended to enforce folder separation during upload or indexing to prevent accidental data access across tenants.

## 2. Search Using Folder Filters

To ensure a tenant only retrieves their own documents, apply a `folder` filter when performing a search.

Example using [Workers Binding](/autorag/usage/workers-binding/):

```js
const response = await env.AI.autorag("my-autorag").search({
	query: "When did I sign my agreement contract?",
	filters: {
		type: "eq",
		key: "folder",
		value: `customer-a/contracts/`,
	},
});
```

To filter across multiple folders, or to add date-based filtering, you can use a compound filter with an array of [comparison filters](/autorag/configuration/metadata-filtering/#compound-filter).

---

# Platform

URL: https://developers.cloudflare.com/autorag/platform/

import { DirectoryListing } from "~/components";

<DirectoryListing />

---

# Create a simple search engine

URL: https://developers.cloudflare.com/autorag/how-to/simple-search-engine/

By using the `search` method, you can implement a simple but fast search engine. This example uses [Workers Binding](/autorag/usage/workers-binding/), but can be easily adapted to use the [REST API](/autorag/usage/rest-api/) instead.

To replicate this example remember to:

- Disable `rewrite_query`, as you want to match the original user query
- Configure your AutoRAG to have small chunk sizes, usually 256 tokens is enough

```ts
export interface Env {
	AI: Ai;
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		const userQuery =
			url.searchParams.get("query") ??
			"How do I train a llama to deliver coffee?";
		const searchResult = await env.AI.autorag("my-rag").search({
			query: userQuery,
			rewrite_query: false,
		});

		return Response.json({
			files: searchResult.data.map((obj) => obj.filename),
		});
	},
} satisfies ExportedHandler<Env>;
```

---

# Limits & pricing

URL: https://developers.cloudflare.com/autorag/platform/limits-pricing/

## Pricing

During the open beta, AutoRAG is **free to enable**. When you create an AutoRAG instance, it provisions and runs on top of Cloudflare services in your account. These resources are **billed as part of your Cloudflare usage**, and includes:

| Service & Pricing                                | Description                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [**R2**](/r2/pricing/)                           | Stores your source data                                                                   |
| [**Vectorize**](/vectorize/platform/pricing/)    | Stores vector embeddings and powers semantic search                                       |
| [**Workers AI**](/workers-ai/platform/pricing/)  | Handles image-to-Markdown conversion, embedding, query rewriting, and response generation |
| [**AI Gateway**](/ai-gateway/reference/pricing/) | Monitors and controls model usage                                                         |

For more information about how each resource is used within AutoRAG, reference [How AutoRAG works](/autorag/concepts/how-autorag-works/).

## Limits

The following limits currently apply to AutoRAG during the open beta:

| Limit                             | Value                                                                                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Max AutoRAG instances per account | 10                                                                                                                                                                |
| Max files per AutoRAG             | 100,000                                                                                                                                                           |
| Max file size                     | 4â€¯MB ([Plain text](/autorag/configuration/data-source/#plain-text-file-types)) / 1 MB ([Rich format](/autorag/configuration/data-source/#rich-format-file-types)) |

These limits are subject to change as AutoRAG evolves beyond open beta.

---

# Release note

URL: https://developers.cloudflare.com/autorag/platform/release-note/

import { ProductReleaseNotes } from "~/components";

This release notes section covers regular updates and minor fixes. For major feature releases or significant updates, see the [changelog](/changelog).

{/* <!-- Actual content lives in /src/content/release-notes/autorag.yaml. Update the file there for new entries to appear here. For more details, refer to https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/changelog/#yaml-file --> */}

<ProductReleaseNotes />

---

# Usage

URL: https://developers.cloudflare.com/autorag/usage/

import { DirectoryListing } from "~/components";

<DirectoryListing />

---

# REST API

URL: https://developers.cloudflare.com/autorag/usage/rest-api/

import {
	Badge,
	Description,
	Render,
	TabItem,
	Tabs,
	WranglerConfig,
	MetaInfo,
	Type,
} from "~/components";

This guide will instruct you through how to use the AutoRAG REST API to make a query to your AutoRAG.

## Prerequisite: Get AutoRAG API token

You need an API token with the `AutoRAG - Read` and `AutoRAG Edit` permissions to use the REST API. To create a new token:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account.
2. Go to **AI** > **AutoRAG** and select your AutoRAG.
3. Select **Use AutoRAG** then select **API**.
4. Select **Create an API Token**.
5. Review the prefilled information then select **Create API Token**.
6. Select **Copy API Token** and save that value for future use.

## AI Search

This REST API searches for relevant results from your data source and generates a response using the model and the retrieved relevant context:

```bash

curl https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/autorag/rags/{AUTORAG_NAME}/ai-search \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer {API_TOKEN}" \
-d '{
	"query": "How do I train a llama to deliver coffee?",
	"model": @cf/meta/llama-3.3-70b-instruct-sd,
	"rewrite_query": false,
	"max_num_results": 10,
	"ranking_options": {
		"score_threshold": 0.3
	},
	"stream": true,
}'

```

:::note

You can get your `ACCOUNT_ID` by navigating to [Workers & Pages on the dashboard](/fundamentals/setup/find-account-and-zone-ids/#find-account-id-workers-and-pages).

:::

### Parameters

<Render file="ai-search-api-params" product="autorag" />

### Response

This is the response structure without `stream` enabled.

<Render file="ai-search-response" product="autorag" />

## Search

This REST API searches for results from your data source and returns the relevant results:

```bash

curl https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/autorag/rags/{AUTORAG_NAME}/search \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer {API_TOKEN}" \
-d '{
	"query": "How do I train a llama to deliver coffee?",
	"rewrite_query": true,
	"max_num_results": 10,
	"ranking_options": {
		"score_threshold": 0.3
	},
}'

```

:::note

You can get your `ACCOUNT_ID` by navigating to Workers & Pages on the dashboard, and copying the Account ID under Account Details.

:::

### Parameters

<Render file="search-api-params" product="autorag" />

### Response

<Render file="search-response" product="autorag" />

---

# Workers Binding

URL: https://developers.cloudflare.com/autorag/usage/workers-binding/

import {
	Badge,
	Description,
	Render,
	TabItem,
	Tabs,
	WranglerConfig,
	MetaInfo,
	Type,
} from "~/components";

Cloudflareâ€™s serverless platform allows you to run code at the edge to build full-stack applications with [Workers](/workers/). A [binding](/workers/runtime-apis/bindings/) enables your Worker or Pages Function to interact with resources on the Cloudflare Developer Platform.

To use your AutoRAG with Workers or Pages, create an AI binding either in the Cloudflare dashboard (refer to [AI bindings](/pages/functions/bindings/#workers-ai) for instructions), or you can update your [Wrangler file](/workers/wrangler/configuration/). To bind AutoRAG to your Worker, add the following to your Wrangler file:

<WranglerConfig>

```toml
[ai]
binding = "AI" # i.e. available in your Worker on env.AI
```

</WranglerConfig>

## `aiSearch()`

This method searches for relevant results from your data source and generates a response using your default model and the retrieved context, for an AutoRAG named `my-autorag`:

```js
const answer = await env.AI.autorag("my-autorag").aiSearch({
	query: "How do I train a llama to deliver coffee?",
	model: "@cf/meta/llama-3.3-70b-instruct-sd",
	rewrite_query: true,
	max_num_results: 2,
	ranking_options: {
		score_threshold: 0.3,
	},
	stream: true,
});
```

### Parameters

<Render file="ai-search-api-params" product="autorag" />

### Response

This is the response structure without `stream` enabled.

```sh output
{
    "object": "vector_store.search_results.page",
    "search_query": "How do I train a llama to deliver coffee?",
    "response": "To train a llama to deliver coffee:\n\n1. **Build trust** â€” Llamas appreciate patience (and decaf).\n2. **Know limits** â€” Max 3 cups per llama, per `llama-logistics.md`.\n3. **Use voice commands** â€” Start with \"Espresso Express!\"\n4.",
    "data": [
      {
        "file_id": "llama001",
        "filename": "llama/logistics/llama-logistics.md",
        "score": 0.45,
        "attributes": {
          "modified_date": 1735689600000,   // unix timestamp for 2025-01-01
          "folder": "llama/logistics/",
        },
        "content": [
          {
            "id": "llama001",
            "type": "text",
            "text": "Llamas can carry 3 drinks max."
          }
        ]
      },
      {
        "file_id": "llama042",
        "filename": "llama/llama-commands.md",
        "score": 0.4,
        "attributes": {
          "modified_date": 1735689600000,   // unix timestamp for 2025-01-01
          "folder": "llama/",
        },
        "content": [
          {
            "id": "llama042",
            "type": "text",
            "text": "Start with basic commands like 'Espresso Express!' Llamas love alliteration."
          }
        ]
      },
    ],
    "has_more": false,
    "next_page": null
}

```

## `search()`

This method searches for results from your corpus and returns the relevant results, for the AutoRAG instance named `my-autorag`:

```js
const answer = await env.AI.autorag("my-autorag").search({
	query: "How do I train a llama to deliver coffee?",
	rewrite_query: true,
	max_num_results: 2,
	ranking_options: {
		score_threshold: 0.3,
	},
});
```

### Parameters

<Render file="search-api-params" product="autorag" />

### Response

```sh output
{
    "object": "vector_store.search_results.page",
    "search_query": "How do I train a llama to deliver coffee?",
    "data": [
      {
        "file_id": "llama001",
        "filename": "llama/logistics/llama-logistics.md",
        "score": 0.45,
        "attributes": {
          "modified_date": 1735689600000,   // unix timestamp for 2025-01-01
          "folder": "llama/logistics/",
        },
        "content": [
          {
            "id": "llama001",
            "type": "text",
            "text": "Llamas can carry 3 drinks max."
          }
        ]
      },
      {
        "file_id": "llama042",
        "filename": "llama/llama-commands.md",
        "score": 0.4,
        "attributes": {
          "modified_date": 1735689600000,   // unix timestamp for 2025-01-01
          "folder": "llama/",
        },
        "content": [
          {
            "id": "llama042",
            "type": "text",
            "text": "Start with basic commands like 'Espresso Express!' Llamas love alliteration."
          }
        ]
      },
    ],
    "has_more": false,
    "next_page": null
}

```

## Local development

Local development is supported by proxying requests to your deployed AutoRAG instance. When running in local mode, your application forwards queries to the configured remote AutoRAG instance and returns the generated responses as if they were served locally.

---

# Build a RAG from your website

URL: https://developers.cloudflare.com/autorag/tutorial/brower-rendering-autorag-tutorial/

AutoRAG is designed to work out of the box with data in R2 buckets. But what if your content lives on a website or needs to be rendered dynamically?

In this tutorial, weâ€™ll walk through how to:

1. Render your website using Cloudflare's Browser Rendering API
2. Store the rendered HTML in R2
3. Connect it to AutoRAG for querying

## Step 1. Create a Worker to fetch webpages and upload into R2

Weâ€™ll create a Cloudflare Worker that uses Puppeteer to visit your URL, render it, and store the full HTML in your R2 bucket. If you already have an R2 bucket with content youâ€™d like to build a RAG for then you can skip this step.

1. Create a new Worker project named `browser-r2-worker` by running:

```bash
npm create cloudflare@latest -- browser-r2-worker
```

For setup, select the following options:

- For _What would you like to start with_?, choose `Hello World Starter`.
- For _Which template would you like to use_?, choose `Worker only`.
- For _Which language do you want to use_?, choose `TypeScript`.
- For _Do you want to use git for version control_?, choose `Yes`.
- For _Do you want to deploy your application_?, choose `No` (we will be making some changes before deploying).

2. Install `@cloudflare/puppeteer`, which allows you to control the Browser Rendering instance:

```bash
npm i @cloudflare/puppeteer
```

3. Create a new R2 bucket named `html-bucket` by running:

```bash
npx wrangler r2 bucket create html-bucket
```

4. Add the following configurations to your Wrangler configuration file so your Worker can use browser rendering and your new R2 bucket:

```jsonc
{
	"compatibility_flags": ["nodejs_compat"],
	"browser": {
		"binding": "MY_BROWSER",
	},
	"r2_buckets": [
		{
			"binding": "HTML_BUCKET",
			"bucket_name": "html-bucket",
		},
	],
}
```

5. Replace the contents of `src/index.ts` with the following skeleton script:

```typescript
import puppeteer from "@cloudflare/puppeteer";

// Define our environment bindings
interface Env {
	MY_BROWSER: any;
	HTML_BUCKET: R2Bucket;
}

// Define request body structure
interface RequestBody {
	url: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Only accept POST requests
		if (request.method !== "POST") {
			return new Response("Please send a POST request with a target URL", {
				status: 405,
			});
		}

		// Get URL from request body
		const body = (await request.json()) as RequestBody;
		// Note: Only use this parser for websites you own
		const targetUrl = new URL(body.url);

		// Launch browser and create new page
		const browser = await puppeteer.launch(env.MY_BROWSER);
		const page = await browser.newPage();

		// Navigate to the page and fetch its html
		await page.goto(targetUrl.href);
		const htmlPage = await page.content();

		// Create filename and store in R2
		const key = targetUrl.hostname + "_" + Date.now() + ".html";
		await env.HTML_BUCKET.put(key, htmlPage);

		// Close browser
		await browser.close();

		// Return success response
		return new Response(
			JSON.stringify({
				success: true,
				message: "Page rendered and stored successfully",
				key: key,
			}),
			{
				headers: { "Content-Type": "application/json" },
			},
		);
	},
} satisfies ExportedHandler<Env>;
```

6. Once the code is ready, you can deploy it to your Cloudflare account by running:

```bash
npx wrangler deploy
```

7. To test your Worker, you can use the following cURL request to fetch the HTML file of a page. In this example we are fetching this page to upload into the `html-bucket` bucket:

```bash
curl -X POST https://browser-r2-worker.<YOUR_SUBDOMAIN>.workers.dev \
-H "Content-Type: application/json" \
-d '{"url": "https://developers.cloudflare.com/autorag/tutorial/brower-rendering-autorag-tutorial/"}'
```

## Step 2. Create your AutoRAG and monitor the indexing

Now that you have created your R2 bucket and filled it with your content that youâ€™d like to query from, you are ready to create an AutoRAG instance:

1. In your [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/ai/autorag), navigate to AI > AutoRAG
2. Select Create AutoRAG and complete the setup process:
   1. Select the **R2 bucket** which contains your knowledge base, in this case, select the `html-bucket`.
   2. Select an **embedding model** used to convert your data to vector representation. It is recommended to use the Default.
   3. Select an **LLM** to use to generate your responses. It is recommended to use the Default.
   4. Select or create an **AI Gateway** to monitor and control your model usage.
   5. **Name** your AutoRAG as `my-rag`
   6. Select or create a **Service API** token to grant AutoRAG access to create and access resources in your account.
3. Select Create to spin up your AutoRAG.

Once youâ€™ve created your AutoRAG, it will automatically create a Vectorize database in your account and begin indexing the data.

You can view the progress of your indexing job in the Overview page of your AutoRAG.

![AutoRAG Overview page](~/assets/images/autorag/tutorial-indexing-page.png)

## Step 3. Test and add to your application

Once AutoRAG finishes indexing your content, youâ€™re ready to start asking it questions. You can open up your AutoRAG instance, navigate to the Playground tab, and ask a question based on your uploaded content, like â€œWhat is AutoRAG?â€.

Once youâ€™re happy with the results in the Playground, you can integrate AutoRAG directly into the application that you are building. If you are using a Worker to build your [RAG application](/autorag/), then you can use the AI binding to directly call your AutoRAG:

```jsonc
{
	"ai": {
		"binding": "AI",
	},
}
```

Then, query your AutoRAG instance from your Worker code by calling the `aiSearch()` method.

```javascript
const answer = await env.AI.autorag("my-rag").aiSearch({
	query: "What is AutoRAG?",
});
```

For more information on how to add AutoRAG into your application, go to your AutoRAG then navigate to Use AutoRAG for more instructions.

---

# Tutorial

URL: https://developers.cloudflare.com/autorag/tutorial/

import { DirectoryListing } from "~/components";

<DirectoryListing />

---