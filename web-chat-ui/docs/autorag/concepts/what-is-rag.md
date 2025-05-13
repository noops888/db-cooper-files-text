1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Concepts](/autorag/concepts/)
5. [What is RAG](/autorag/concepts/what-is-rag/)
   

# What is RAG

Copy Page

Retrieval-Augmented Generation (RAG) is a way to use your own data with a large language model (LLM). Instead of relying only on what the model was trained on, RAG searches for relevant information from your data source and uses it to help answer questions.

## How RAG works

Hereâs a simplified overview of the RAG pipeline:

1. **Indexing:** Your content (e.g. docs, wikis, product information) is split into smaller chunks and converted into vectors using an embedding model. These vectors are stored in a vector database.
2. **Retrieval:** When a user asks a question, itâs also embedded into a vector and used to find the most relevant chunks from the vector database.
3. **Generation:** The retrieved content and the userâs original question are combined into a single prompt. An LLM uses that prompt to generate a response.

The resulting response should be accurate, relevant, and based on your own data.

![What is RAG](/_astro/RAG.Br2ehjiz_2lPBPi.webp)


How does AutoRAG work

To learn more details about how AutoRAG uses RAG under the hood, reference [How AutoRAG works](/autorag/concepts/how-autorag-works/).

## Why use RAG?

RAG lets you bring your own data into LLM generation without retraining or fine-tuning a model. It improves both accuracy and trust by retrieving relevant content at query time and using that as the basis for a response.

Benefits of using RAG:

* **Accurate and current answers:** Responses are based on your latest content, not outdated training data.
* **Control over information sources:** You define the knowledge base so answers come from content you trust.
* **Fewer hallucinations:** Responses are grounded in real, retrieved data, reducing made-up or misleading answers.
* **No model training required:** You can get high-quality results without building or fine-tuning your own LLM which can be time consuming and costly.

RAG is ideal for building AI-powered apps like:

* AI assistants for internal knowledge
* Support chatbots connected to your latest content
* Enterprise search across documentation and files
