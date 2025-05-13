1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Configuration](/autorag/configuration/)
5. [Indexing](/autorag/configuration/indexing/)
   

# Indexing

Copy Page

AutoRAG automatically indexes your data into vector embeddings optimized for semantic search. Once a data source is connected, indexing runs continuously in the background to keep your knowledge base fresh and queryable.

## Jobs

AutoRAG automatically monitors your data source for updates and reindexes your content **every 4 hours**. During each cycle, only new or modified files are reprocessed to keep your Vectorize index up to date.

## Controls

You can control indexing behavior through the following actions on the dashboard:

* **Sync Index**: Force AutoRAG to scan your data source for new or modified files and initiate an indexing job to update the associated Vectorize index. A new indexing job can be initiated every 5 minutes.
* **Pause Indexing**: Temporarily stop all scheduled indexing checks and reprocessing. Useful for debugging or freezing your knowledge base.

## Performance

AutoRAG processes files in parallel for efficient indexing. The total time to index depends on the number and type of files in your data source.

Factors that affect performance include:

* Total number of files and their sizes
* File formats (for example, images take longer than plain text)
* Latency of Workers AI models used for embedding and image processing

## Best practices

To ensure smooth and reliable indexing:

* Make sure your files are within the [**size limit**](/autorag/platform/limits-pricing/#limits) and in a supported format to avoid being skipped.
* Keep your Service API token valid to prevent indexing failures.
* Regularly clean up outdated or unnecessary content in your knowledge base to avoid hitting [Vectorize index limits](/vectorize/platform/limits/).
