1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [How to](/autorag/how-to/)
5. [Create multitenancy](/autorag/how-to/multitenancy/)
   

# Create multitenancy

Copy Page

AutoRAG supports multitenancy by letting you segment content by tenant, so each user, customer, or workspace can only access their own data. This is typically done by organizing documents into per-tenant folders and applying [metadata filters](/autorag/configuration/metadata-filtering/) at query time.

## 1. Organize Content by Tenant

When uploading files to R2, structure your content by tenant using unique folder paths.

Example folder structure:

Terminal window

```


customer-a/logs/



customer-a/contracts/



customer-b/contracts/


```

When indexing, AutoRAG will automatically store the folder path as metadata under the `folder` attribute. It is recommended to enforce folder separation during upload or indexing to prevent accidental data access across tenants.

## 2. Search Using Folder Filters

To ensure a tenant only retrieves their own documents, apply a `folder` filter when performing a search.

Example using [Workers Binding](/autorag/usage/workers-binding/):

```


const response = await env.AI.autorag("my-autorag").search({



query: "When did I sign my agreement contract?",



filters: {



type: "eq",



key: "folder",



value: `customer-a/contracts/`,



},



});


```

To filter across multiple folders, or to add date-based filtering, you can use a compound filter with an array of [comparison filters](/autorag/configuration/metadata-filtering/#compound-filter).
