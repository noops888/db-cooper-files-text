1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Getting started](/autorag/get-started/)
   

# Getting started

Copy Page

AutoRAG allows developers to create fully managed retrieval-augmented generation (RAG) pipelines to power AI applications with accurate and up-to-date information without needing to manage infrastructure.

## 1. Upload data or use existing data in R2

AutoRAG integrates with R2 for data import. Create an R2 bucket if you do not have one and upload your data.

Note

Before you create your first bucket, you must purchase R2 from the Cloudflare dashboard.

To create and upload objects to your bucket from the Cloudflare dashboard:

1. Log in to the [Cloudflare dashboard â](https://dash.cloudflare.com/?to=/:account/r2) and select **R2**.
2. Select Create bucket, name the bucket, and select **Create bucket**.
3. Choose to either drag and drop your file into the upload area or **select from computer**. Review the [file limits](/autorag/configuration/data-source/) when creating your knowledge base.

*If you need inspiration for what document to use to make your first AutoRAG, try downloading and uploading the [RSS](/changelog/rss/index.xml) of the [Cloudflare Changelog](/changelog/).*

## 2. Create an AutoRAG

To create a new AutoRAG:

1. Log in to the [Cloudflare dashboard â](https://dash.cloudflare.com/?to=/:account/ai/autorag) and select **AI** > **AutoRAG**.
2. Select **Create AutoRAG**, configure the AutoRAG, and complete the setup process.
3. Select **Create**.

## 3. Monitor indexing

Once created, AutoRAG will create a Vectorize index in your account and begin indexing the data.

To monitor the indexing progress:

1. From the **AutoRAG** page in the dashboard, locate and select your AutoRAG.
2. Navigate to the **Overview** page to view the current indexing status.

## 4. Try it out

Once indexing is complete, you can run your first query:

1. From the **AutoRAG** page in the dashboard, locate and select your AutoRAG.
2. Navigate to the **Playground** page.
3. Select **Search with AI** or **Search**.
4. Enter a **query** to test out its response.

## 5. Add to your application

There are multiple ways you can create [RAG applications](/autorag/) with Cloudflare AutoRAG:

* [Workers Binding](/autorag/usage/workers-binding/)
* [REST API](/autorag/usage/rest-api/)
