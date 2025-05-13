import json, sys

A = "search_backup.json"
B = "search_backup-044.json"
OUT = "merged.json"
KEY = "id"              # ← your primary key field

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def main():
    a = load(A); b = load(B)
    if not (isinstance(a, list) and isinstance(b, list)):
        sys.exit("✗ Expected both inputs as JSON arrays.")
    # Build map of existing IDs
    ids = {doc[KEY] for doc in a}
    # Check for collisions
    dup = [d for d in b if d[KEY] in ids]
    if dup:
        sys.exit(f"✗ Duplicate IDs in B: {[d[KEY] for d in dup]}")
    merged = a + b
    # Write out
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    print(f"✓ Wrote {len(merged)} docs to {OUT}")

if __name__=="__main__":
    main()
    