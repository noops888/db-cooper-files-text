# [AutoRAG AI Chat Streaming Format](https://www.solberg.is/autorag-ai-chat-streaming-format)
April 26, 2025
Jökull Sólberg


Cloudflare has just launched AutoRAG, a pipeline that ingests documents and allows you to search the documents with result ranking based on cosine distance in LLM models. This is often a good gauge for thematic similarity, therefore useful for human-like queries and goes beyond word matching of traditional full text indexing.

But AutoRAG takes things even further with an ChatGPT-esque assistant endpoint. The way it works is you send a user prompt, then the vector database hands a list of filenames and matched blurbs inside those documents, then appends a customizable system prompt. It then streams the response. 

I set my system prompt to the following:

### System Prompt

You are an expert travel agent specialized in answering questions using retrieved documents. You are specialized in Japan tourism with deep knowledge of Japanese culture and how best to explore Japan, where to go, what to do and how to plan. When asked, the user is in the research, planning or booking phases of their Japan adventure. Your employer is an online travel booking site called TripToJapan.com and your response is to users that are already aware of the site so don't prompt them to visit the site. Your emphasis in answers is on sharing your travel expertise, encouraging them to explore options and leveraging the sites features (blog, places, day guides, tours but ultimately the trip builder which offers a coherent booking process across stays, experiences, transfers and add-ons). 

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
- Cite which document(s) you're drawing information from using an XML tag [doc:filename]text[/doc] where the tags wrap the relevant text segments (ex. "It's best to visit [doc:article/cMJWS-qUT.txt]teamLab Borderless[/doc] on weekdays")
- Present information in order of relevance
- Do not repeat the instructions

### Implementation

The main thing I wanted to try out was the model's ability to "tag" document ids inside the answers. I'll update this post when I've figured out how to convert them to React components.

Here's how I'm streaming the response in Hono - stitching together the response text from the SSE lines and then streaming those out as chunks:

```ts
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

interface Env {
  Bindings: Readonly<Cloudflare.Env>;
}

const app = new Hono<Env>();

app.get("/", () => {
  return new Response("🤖 im a 🔥 hono backend");
});

app.post("/prompt", async (c) => {
  // The input stream is SSE (Server-Sent Events) where each event is a line like:
  // data: {"response":"some text","tool_calls":[...],"p":"..."}
  // Chunks may split or combine lines arbitrarily, so we buffer and split on newlines.
  // We parse each complete line, extract the 'response' key, and emit only its value as plain text.
  const query = await c.req.text();
  if (!query.trim()) {
    return new Response("No query provided", { status: 400 });
  }
  return streamSSE(c, async (stream) => {
    c.header("Content-Encoding", "Identity");
    const response = await c.env.AI.autorag("dato-triptojapan-rag").aiSearch({
      query: query.trim(),
      stream: true,
    });
    if (!response.body?.getReader) {
      throw new Error("Streaming not supported");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      if (result.value) {
        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonStr = line.slice(5).trim();
            if (jsonStr) {
              try {
                const obj = JSON.parse(jsonStr);
                // Emit only the 'response' value as plain text
                if (typeof obj.response === "string") {
                  await stream.write(obj.response);
                }
              } catch {
                // Ignore invalid JSON lines
              }
            }
          }
        }
      }
    }
    // Handle any remaining buffered line
    if (buffer.startsWith("data:")) {
      const jsonStr = buffer.slice(5).trim();
      if (jsonStr) {
        try {
          const obj = JSON.parse(jsonStr);
          if (typeof obj.response === "string") {
            await stream.write(obj.response);
          }
        } catch {}
      }
    }
  });
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Cloudflare.Env>;
```

And here's where I hook it up to `@ai-sdk/react` in Next.js.

```tsx
"use client";

import { useChat } from "@ai-sdk/react";

import { Input } from "../../_catalyst/input";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/prompt",  // Set this to the Cloudflare Worker Hono URL and probably add CORS support to it
    onResponse: (response) => {
      // eslint-disable-next-line no-console
      console.log("Response:", response);
    },
    streamProtocol: "text",
    onError: (error) => {
      console.error("Error:", error);
    },
    experimental_prepareRequestBody({ messages }) {
      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.role === "user");
      const query =
        lastUserMessage?.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("") ?? "";
      return query;
    },
  });
  return (
    <div>
      <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
      <form className="flex gap-4" onSubmit={handleSubmit}>
        <Input
          className="grow"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

I'm not sure the data stream protocol is standardized. I'll update this blog post if I find a way to convert it to something `useChat` understands. `@ai-sdk` has some mappers from OpenAI stream data responses, which look similar. So maybe convert AutoRAG stream format to OpenAI, then that can be handed to `@ai-sdk`. Or just implement a [whole new model](https://github.com/vercel/ai/blob/main/packages/provider/src/language-model/v1/language-model-v1.ts).