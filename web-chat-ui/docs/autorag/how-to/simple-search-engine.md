1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [How to](/autorag/how-to/)
5. [Create a simple search engine](/autorag/how-to/simple-search-engine/)
   

# Create a simple search engine

Copy Page

By using the `search` method, you can implement a simple but fast search engine. This example uses [Workers Binding](/autorag/usage/workers-binding/), but can be easily adapted to use the [REST API](/autorag/usage/rest-api/) instead.

To replicate this example remember to:

* Disable `rewrite_query`, as you want to match the original user query
* Configure your AutoRAG to have small chunk sizes, usually 256 tokens is enough

```


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
