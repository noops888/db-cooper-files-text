1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [System prompt](/autorag/configuration/system-prompt/)
   

# System prompt

Copy Page

System prompts allow you to guide the behavior of the text-generation models used by AutoRAG at query time. AutoRAG supports system prompt configuration in two steps:

* **Query rewriting**: Reformulates the original user query to improve semantic retrieval. A system prompt can guide how the model interprets and rewrites the query.
* **Generation**: Generates the final response from retrieved context. A system prompt can help define how the model should format, filter, or prioritize information when constructing the answer.

## What is a system prompt?

A system prompt is a special instruction sent to a large language model (LLM) that guides how it behaves during inference. The system prompt defines the model's role, context, or rules it should follow.

System prompts are particularly useful for:

* Enforcing specific response formats
* Constraining behavior (for example, it only responds based on the provided content)
* Applying domain-specific tone or terminology
* Encouraging consistent, high-quality output

## How to set your system prompt

The system prompt for your AutoRAG can be set after it has been created by:

1. Navigating to the [Cloudflare dashboard â](https://dash.cloudflare.com/?to=/:account/ai/autorag), and go to AI > AutoRAG
2. Select your AutoRAG
3. Go to Settings page and find the System prompt setting for either Query rewrite or Generation

### Default system prompt

When configuring your AutoRAG instance, you can provide your own system prompts. If you do not provide a system prompt, AutoRAG will use the **default system prompt** provided by Cloudflare.

You can view the effective system prompt used for any AutoRAG's model call through AI Gateway logs, where model inputs and outputs are recorded.

Note

The default system prompt can change and evolve over time to improve performance and quality.

## Query rewriting system prompt

If query rewriting is enabled, you can provide a custom system prompt to control how the model rewrites user queries. In this step, the model receives:

* The query rewrite system prompt
* The original user query

The model outputs a rewritten query optimized for semantic retrieval.

### Example

```


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

* The user's original query
* Retrieved document chunks (with metadata)
* The generation system prompt

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
