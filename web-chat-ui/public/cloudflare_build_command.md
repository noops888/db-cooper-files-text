Framework preset: none
Build command: if [ "$CF_PAGES_BRANCH" != "main" ]; then printf "%b\\n" "/*\\n\\tCache-Control: no-cache, no-store, must-revalidate" > public/_headers && echo "Preview build: Applied no-cache headers."; else echo "Production build: Skipping no-cache headers."; fi && echo "Running endpoint replacement..." && sed -i "s#__AGENT_ENDPOINT_URL__#${AGENT_ENDPOINT_URL}#g" public/app.js && echo "Endpoint replacement finished."

Build output directory: /public
Path: /

