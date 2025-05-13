1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Usage](/autorag/usage/)
5. [REST API](/autorag/usage/rest-api/)
   

# REST API

Copy Page

This guide will instruct you through how to use the AutoRAG REST API to make a query to your AutoRAG.

## Prerequisite: Get AutoRAG API token

You need an API token with the `AutoRAG - Read` and `AutoRAG Edit` permissions to use the REST API. To create a new token:

1. Log in to the [Cloudflare dashboard â](https://dash.cloudflare.com) and select your account.
2. Go to **AI** > **AutoRAG** and select your AutoRAG.
3. Select **Use AutoRAG** then select **API**.
4. Select **Create an API Token**.
5. Review the prefilled information then select **Create API Token**.
6. Select **Copy API Token** and save that value for future use.

## AI Search

This REST API searches for relevant results from your data source and generates a response using the model and the retrieved relevant context:

Terminal window

```


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

Note

You can get your `ACCOUNT_ID` by navigating to [Workers & Pages on the dashboard](/fundamentals/setup/find-account-and-zone-ids/#find-account-id-workers-and-pages).

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



"success": true,



"result": {



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



}


```

## Search

This REST API searches for results from your data source and returns the relevant results:

Terminal window

```


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

Note

You can get your `ACCOUNT_ID` by navigating to Workers & Pages on the dashboard, and copying the Account ID under Account Details.

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



"success": true,



"result": {



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



}


```
