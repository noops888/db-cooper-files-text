1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
   

# Configuration

Copy Page

When creating an AutoRAG instance, you can customize how your RAG pipeline ingests, processes, and responds to data using a set of configuration options. Some settings can be updated after the instance is created, while others are fixed at creation time.

The table below lists all available configuration options:

| Configuration | Editable after creation | Description |
| --- | --- | --- |
| [Data source](/autorag/configuration/data-source/) | no | The source where your knowledge base is stored |
| [Chunk size](/autorag/configuration/chunking/) | yes | Number of tokens per chunk |
| [Chunk overlap](/autorag/configuration/chunking/) | yes | Number of overlapping tokens between chunks |
| [Embedding model](/autorag/configuration/models/) | no | Model used to generate vector embeddings |
| [Query rewrite](/autorag/configuration/query-rewriting/) | yes | Enable or disable query rewriting before retrieval |
| [Query rewrite model](/autorag/configuration/models/) | yes | Model used for query rewriting |
| [Query rewrite system prompt](/autorag/configuration/system-prompt/) | yes | Custom system prompt to guide query rewriting behavior |
| [Match threshold](/autorag/configuration/retrieval-configuration/) | yes | Minimum similarity score required for a vector match |
| [Maximum number of results](/autorag/configuration/retrieval-configuration/) | yes | Maximum number of vector matches returned (`top_k`) |
| [Generation model](/autorag/configuration/models/) | yes | Model used to generate the final response |
| [Generation system prompt](/autorag/configuration/system-prompt/) | yes | Custom system prompt to guide response generation |
| [Similarity caching](/autorag/configuration/cache/) | yes | Enable or disable caching of responses for similar (not just exact) prompts |
| [Similarity caching threshold](/autorag/configuration/cache/) | yes | Controls how similar a new prompt must be to a previous one to reuse its cached response |
| [AI Gateway](/ai-gateway) | yes | AI Gateway for monitoring and controlling model usage |
| AutoRAG name | no | Name of your AutoRAG instance |
| Service API token | yes | API token granted to AutoRAG to give it permission to configure resources on your account. |

API token

The Service API token is different from the AutoRAG API token that you can make to interact with your AutoRAG. The Service API token is only used by AutoRAG to get permissions to configure resources on your account.
