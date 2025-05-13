import requests
import json

# ==== CONFIGURE THESE VALUES ====
SERVICE_NAME = "gptkb-w5qjcvd65hnf6"  # From Azure service name
INDEX_NAME = "gptkbindex"             # Your index name
ADMIN_KEY = ""                        # Your admin key
# =================================

base_url = f"https://{SERVICE_NAME}.search.windows.net/indexes/{INDEX_NAME}"
headers = {
    "Content-Type": "application/json",
    "api-key": ADMIN_KEY
}

def get_all_docs():
    all_docs = []
    page_size = 1000
    skip = 0
    
    while True:
        # Build the search request
        url = f"{base_url}/docs/search?api-version=2023-11-01"
        body = {
            "search": "*",
            "count": "true",
            "top": page_size,
            "skip": skip
        }
        
        try:
            response = requests.post(url, headers=headers, json=body)
            response.raise_for_status()  # Crash if error
            data = response.json()
            
            if not data["value"]:
                break  # No more documents
                
            all_docs.extend(data["value"])
            print(f"Fetched {len(all_docs)}/{data['@odata.count']} docs...")
            skip += page_size
            
        except Exception as e:
            print(f"ERROR: {str(e)}")
            print("Response content:", response.text)
            break
            
    return all_docs

# Run and save
print("Starting export...")
documents = get_all_docs()
with open("search_backup.json", "w") as f:
    json.dump(documents, f, indent=2)
print(f"Done! Saved {len(documents)} documents to search_backup.json")

