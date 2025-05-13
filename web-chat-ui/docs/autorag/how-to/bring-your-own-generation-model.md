1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [How to](/autorag/how-to/)
5. [Bring your own generation model](/autorag/how-to/bring-your-own-generation-model/)
   

# Bring your own generation model

Copy Page

When using `AI Search`, AutoRAG leverages a Workers AI model to generate the response. If you want to use a model outside of Workers AI, you can use AutoRAG for search while leveraging a model outside of Workers AI to generate responses.

Here is an example of how you can use an OpenAI model to generate your responses. This example uses [Workers Binding](/autorag/usage/workers-binding/), but can be easily adapted to use the [REST API](/autorag/usage/rest-api/) instead.

```


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
