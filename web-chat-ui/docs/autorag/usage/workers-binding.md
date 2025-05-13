1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Usage](/autorag/usage/)
5. [Workers Binding](/autorag/usage/workers-binding/)
   

# Workers Binding

Copy Page

Cloudflareâs serverless platform allows you to run code at the edge to build full-stack applications with [Workers](/workers/). A [binding](/workers/runtime-apis/bindings/) enables your Worker or Pages Function to interact with resources on the Cloudflare Developer Platform.

To use your AutoRAG with Workers or Pages, create an AI binding either in the Cloudflare dashboard (refer to [AI bindings](/pages/functions/bindings/#workers-ai) for instructions), or you can update your [Wrangler file](/workers/wrangler/configuration/). To bind AutoRAG to your Worker, add the following to your Wrangler file:

* [wrangler.jsonc](#tab-panel-502)
* [wrangler.toml](#tab-panel-503)

```


{



"ai": {



"binding": "AI"



}



}


```

```


[ai]



binding = "AI" # i.e. available in your Worker on env.AI


```

  

## `aiSearch()`

This method searches for relevant results from your data source and generates a response using your default model and the retrieved context, for an AutoRAG named `my-autorag`:

```


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

`query` string required

The input query.

`model` string optional

The text-generation model that is used to generate the response for the query. For a list of valid options, check the AutoRAG Generation model Settings. Defaults to the generation model selected in the AutoRAG Settings.

`rewrite_query` boolean optional

Rewrites the original query into a search optimized query to improve retrieval accuracy. Defaults to `false`.

`max_num_results` number optional

The maximum number of results that can be returned from the Vectorize database. Defaults to `10`. Must be between `1` and `50`.

`ranking_options` object optional

Configurations for customizing result ranking. Defaults to `{}`.

* `score_threshold` number optional
  + The minimum match score required for a result to be considered a match. Defaults to `0`. Must be between `0` and `1`.

`stream` boolean optional

Returns a stream of results as they are available. Defaults to `false`.

`filters` object optional

Narrow down search results based on metadata, like folder and date, so only relevant content is retrieved. For more details, refer to [Metadata filtering](/autorag/configuration/metadata-filtering).

### Response

This is the response structure without `stream` enabled.

```


{



"object": "vector_store.search_results.page",



"search_query": "How do I train a llama to deliver coffee?",



"response": "To train a llama to deliver coffee:\n\n1. **Build trust** â Llamas appreciate patience (and decaf).\n2. **Know limits** â Max 3 cups per llama, per `llama-logistics.md`.\n3. **Use voice commands** â Start with \"Espresso Express!\"\n4.",



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

```


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

`query` string required

The input query.

`rewrite_query` boolean optional

Rewrites the original query into a search optimized query to improve retrieval accuracy. Defaults to `false`.

`max_num_results` number optional

The maximum number of results that can be returned from the Vectorize database. Defaults to `10`. Must be between `1` and `50`.

`ranking_options` object optional

Configurations for customizing result ranking. Defaults to `{}`.

* `score_threshold` number optional
  + The minimum match score required for a result to be considered a match. Defaults to `0`. Must be between `0` and `1`.

`filters` object optional

Narrow down search results based on metadata, like folder and date, so only relevant content is retrieved. For more details, refer to [Metadata filtering](/autorag/configuration/metadata-filtering).

### Response

```


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
