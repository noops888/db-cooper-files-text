1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [Models](/autorag/configuration/models/)
   

# Models

Copy Page

AutoRAG uses models at multiple steps of the RAG pipeline. You can configure which models are used, or let AutoRAG automatically select defaults optimized for general use.

## Models used

AutoRAG leverages Workers AI models in the following stages:

* **Image to markdown conversion (if images are in data source)**: Converts image content to Markdown using object detection and captioning models.
* **Embedding**: Transforms your documents and queries into vector representations for semantic search.
* **Query rewriting (optional)**: Reformulates the userâs query to improve retrieval accuracy.
* **Generation**: Produces the final response from retrieved context.

## Model providers

AutoRAG currently only supports [Workers AI](/workers-ai/) as the model provider. Usage of models through AutoRAG contributes to your Workers AI usage and is billed as part of your account.

If you have connected your project to [AI Gateway](/ai-gateway), all model calls triggered by AutoRAG can be tracked in AI Gateway. This gives you full visibility into inputs, outputs, latency, and usage patterns.

## Choosing a model

When configuring your AutoRAG instance, you can specify the exact model to use for each step of embedding, rewriting, and generation. You can find available models that can be used with AutoRAG in the **Settings** of your AutoRAG.

Note

AutoRAG supports a subset of Workers AI models that have been selected to provide the best experience for RAG.

### Smart default

If you choose **Smart Default** in your model selection, then AutoRAG will select a Cloudflare recommended model. These defaults may change over time as Cloudflare evaluates and updates model choices. You can switch to explicit model configuration at any time by visiting **Settings**.

### Per-request generation model override

While the generation model can be set globally at the AutoRAG instance level, you can also override it on a per-request basis in the [AI Search API](/autorag/usage/rest-api/#ai-search). This is useful if your [RAG application](/autorag/) requires dynamic selection of generation models based on context or user preferences.
