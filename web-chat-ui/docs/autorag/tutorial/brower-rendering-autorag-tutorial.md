1. [Products](/products/)
2. â¦
3. [AutoRAG](/autorag/)
4. [Tutorial](/autorag/tutorial/)
5. [Build a RAG from your website](/autorag/tutorial/brower-rendering-autorag-tutorial/)
   

# Build a RAG from your website

Copy Page

AutoRAG is designed to work out of the box with data in R2 buckets. But what if your content lives on a website or needs to be rendered dynamically?

In this tutorial, weâll walk through how to:

1. Render your website using Cloudflare's Browser Rendering API
2. Store the rendered HTML in R2
3. Connect it to AutoRAG for querying

## Step 1. Create a Worker to fetch webpages and upload into R2

Weâll create a Cloudflare Worker that uses Puppeteer to visit your URL, render it, and store the full HTML in your R2 bucket. If you already have an R2 bucket with content youâd like to build a RAG for then you can skip this step.

1. Create a new Worker project named `browser-r2-worker` by running:

Terminal window

```


npm create cloudflare@latest -- browser-r2-worker


```

For setup, select the following options:

* For *What would you like to start with*?, choose `Hello World Starter`.
* For *Which template would you like to use*?, choose `Worker only`.
* For *Which language do you want to use*?, choose `TypeScript`.
* For *Do you want to use git for version control*?, choose `Yes`.
* For *Do you want to deploy your application*?, choose `No` (we will be making some changes before deploying).

2. Install `@cloudflare/puppeteer`, which allows you to control the Browser Rendering instance:

Terminal window

```


npm i @cloudflare/puppeteer


```

3. Create a new R2 bucket named `html-bucket` by running:

Terminal window

```


npx wrangler r2 bucket create html-bucket


```

4. Add the following configurations to your Wrangler configuration file so your Worker can use browser rendering and your new R2 bucket:

```


{



"compatibility_flags": ["nodejs_compat"],



"browser": {



"binding": "MY_BROWSER",



},



"r2_buckets": [



{



"binding": "HTML_BUCKET",



"bucket_name": "html-bucket",



},



],



}


```

5. Replace the contents of `src/index.ts` with the following skeleton script:

```


import puppeteer from "@cloudflare/puppeteer";



// Define our environment bindings



interface Env {



MY_BROWSER: any;



HTML_BUCKET: R2Bucket;



}



// Define request body structure



interface RequestBody {



url: string;



}



export default {



async fetch(request: Request, env: Env): Promise<Response> {



// Only accept POST requests



if (request.method !== "POST") {



return new Response("Please send a POST request with a target URL", {



status: 405,



});



}



// Get URL from request body



const body = (await request.json()) as RequestBody;



// Note: Only use this parser for websites you own



const targetUrl = new URL(body.url);



// Launch browser and create new page



const browser = await puppeteer.launch(env.MY_BROWSER);



const page = await browser.newPage();



// Navigate to the page and fetch its html



await page.goto(targetUrl.href);



const htmlPage = await page.content();



// Create filename and store in R2



const key = targetUrl.hostname + "_" + Date.now() + ".html";



await env.HTML_BUCKET.put(key, htmlPage);



// Close browser



await browser.close();



// Return success response



return new Response(



JSON.stringify({



success: true,



message: "Page rendered and stored successfully",



key: key,



}),



{



headers: { "Content-Type": "application/json" },



},



);



},



} satisfies ExportedHandler<Env>;


```

6. Once the code is ready, you can deploy it to your Cloudflare account by running:

Terminal window

```


npx wrangler deploy


```

7. To test your Worker, you can use the following cURL request to fetch the HTML file of a page. In this example we are fetching this page to upload into the `html-bucket` bucket:

Terminal window

```


curl -X POST https://browser-r2-worker.<YOUR_SUBDOMAIN>.workers.dev \



-H "Content-Type: application/json" \



-d '{"url": "https://developers.cloudflare.com/autorag/tutorial/brower-rendering-autorag-tutorial/"}'


```

## Step 2. Create your AutoRAG and monitor the indexing

Now that you have created your R2 bucket and filled it with your content that youâd like to query from, you are ready to create an AutoRAG instance:

1. In your [Cloudflare Dashboard â](https://dash.cloudflare.com/?to=/:account/ai/autorag), navigate to AI > AutoRAG
2. Select Create AutoRAG and complete the setup process:
   1. Select the **R2 bucket** which contains your knowledge base, in this case, select the `html-bucket`.
   2. Select an **embedding model** used to convert your data to vector representation. It is recommended to use the Default.
   3. Select an **LLM** to use to generate your responses. It is recommended to use the Default.
   4. Select or create an **AI Gateway** to monitor and control your model usage.
   5. **Name** your AutoRAG as `my-rag`
   6. Select or create a **Service API** token to grant AutoRAG access to create and access resources in your account.
3. Select Create to spin up your AutoRAG.

Once youâve created your AutoRAG, it will automatically create a Vectorize database in your account and begin indexing the data.

You can view the progress of your indexing job in the Overview page of your AutoRAG.

![AutoRAG Overview page](/_astro/tutorial-indexing-page.z5T474L5_2eSF9A.webp)

## Step 3. Test and add to your application

Once AutoRAG finishes indexing your content, youâre ready to start asking it questions. You can open up your AutoRAG instance, navigate to the Playground tab, and ask a question based on your uploaded content, like âWhat is AutoRAG?â.

Once youâre happy with the results in the Playground, you can integrate AutoRAG directly into the application that you are building. If you are using a Worker to build your [RAG application](/autorag/), then you can use the AI binding to directly call your AutoRAG:

```


{



"ai": {



"binding": "AI",



},



}


```

Then, query your AutoRAG instance from your Worker code by calling the `aiSearch()` method.

```


const answer = await env.AI.autorag("my-rag").aiSearch({



query: "What is AutoRAG?",



});


```

For more information on how to add AutoRAG into your application, go to your AutoRAG then navigate to Use AutoRAG for more instructions.
