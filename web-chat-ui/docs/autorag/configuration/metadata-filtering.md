1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [Metadata filtering](/autorag/configuration/metadata-filtering/)
   

# Metadata filtering

Copy Page

Metadata filtering narrows down search results based on metadata, so only relevant content is retrieved. The filter narrows down results prior to retrieval, so that you only query the scope of documents that matter.

Here is an example of metadata filtering using [Workers Binding](/autorag/usage/workers-binding/) but it can be easily adapted to use the [REST API](/autorag/usage/rest-api/) instead.

```


const answer = await env.AI.autorag("my-autorag").search({



query: "How do I train a llama to deliver coffee?",



filters: {



type: "and",



filters: [



{



type: "eq",



key: "folder",



value: "llama/logistics/",



},



{



type: "gte",



key: "timestamp",



value: "1735689600000", // unix timestamp for 2025-01-01



},



],



},



});


```

## Metadata attributes

You can currently filter by the `folder` and `timestamp` of an R2 object. Currently, custom metadata attributes are not supported.

### `folder`

The directory to the object. For example, the `folder` of the object at `llama/logistics/llama-logistics.mdx` is `llama/logistics/`. Note that the `folder` does not include a leading `/`.

Note that `folder` filter only includes files exactly in that folder, so files in subdirectories are not included. For example, specifying `folder: "llama/"` will match files in `llama/` but does not match files in `llama/logistics`.

### `timestamp`

The timestamp indicating when the object was last modified. Comparisons are supported using a 13-digit Unix timestamp (milliseconds), but values will be rounded to 10 digits (seconds). For example, `1735689600999` or `2025-01-01 00:00:00.999 UTC` will be rounded down to `1735689600000`, corresponding to `2025-01-01 00:00:00 UTC`.

## Filter schema

You can create simple comparison filters or an array of comparison filters using a compound filter.

### Comparison filter

You can compare a metadata attribute (for example, `folder` or `timestamp`) with a target value using a comparison filter.

```


filters: {



type: "operator",



key: "metadata_attribute",



value: "target_value"



}


```

The available operators for the comparison are:

| Operator | Description |
| --- | --- |
| `eq` | Equals |
| `ne` | Not equals |
| `gt` | Greater than |
| `gte` | Greater than or equals to |
| `lt` | Less than |
| `lte` | Less than or equals to |

### Compound filter

You can use a compound filter to combine multiple comparison filters with a logical operator.

```


filters: {



type: "compound_operator",



filters: [...]



}


```

The available compound operators are: `and`, `or`.

Note the following limitations with the compound operators:

* No nesting combinations of `and`'s and `or`'s, meaning you can only pick 1 `and` or 1 `or`.
* When using `or`:
  + Only the `eq` operator is allowed.
  + All conditions must filter on the **same key** (for example, all on `folder`)

## Response

You can see the metadata attributes of your retrieved data in the response under the property `attributes` for each retrieved chunk. For example:

```


"data": [



{



"file_id": "llama001",



"filename": "llama/logistics/llama-logistics.md",



"score": 0.45,



"attributes": {



"timestamp": 1735689600000,   // unix timestamp for 2025-01-01



"folder": "llama/logistics/",



},



"content": [



{



"id": "llama001",



"type": "text",



"text": "Llamas can carry 3 drinks max."



}



]



}



]


```
