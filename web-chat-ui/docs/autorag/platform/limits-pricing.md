1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Platform](/autorag/platform/)
5. [Limits & pricing](/autorag/platform/limits-pricing/)
   

# Limits & pricing

Copy Page

## Pricing

During the open beta, AutoRAG is **free to enable**. When you create an AutoRAG instance, it provisions and runs on top of Cloudflare services in your account. These resources are **billed as part of your Cloudflare usage**, and includes:

| Service & Pricing | Description |
| --- | --- |
| [**R2**](/r2/pricing/) | Stores your source data |
| [**Vectorize**](/vectorize/platform/pricing/) | Stores vector embeddings and powers semantic search |
| [**Workers AI**](/workers-ai/platform/pricing/) | Handles image-to-Markdown conversion, embedding, query rewriting, and response generation |
| [**AI Gateway**](/ai-gateway/reference/pricing/) | Monitors and controls model usage |

For more information about how each resource is used within AutoRAG, reference [How AutoRAG works](/autorag/concepts/how-autorag-works/).

## Limits

The following limits currently apply to AutoRAG during the open beta:

| Limit | Value |
| --- | --- |
| Max AutoRAG instances per account | 10 |
| Max files per AutoRAG | 100,000 |
| Max file size | 4â¯MB ([Plain text](/autorag/configuration/data-source/#plain-text-file-types)) / 1 MB ([Rich format](/autorag/configuration/data-source/#rich-format-file-types)) |

These limits are subject to change as AutoRAG evolves beyond open beta.
