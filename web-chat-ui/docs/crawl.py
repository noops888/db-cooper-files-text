#!/usr/bin/env python3
"""
crawl_autorag.py  ––  Convert Cloudflare AutoRAG docs to Markdown
Author: ChatGPT (May 2025)
"""

from __future__ import annotations
import argparse, os, re, time, urllib.parse as up
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from tqdm import tqdm

BASE_URL   = "https://developers.cloudflare.com"
START_PATH = "/autorag/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (+https://github.com/mozilla-firefox/firefox)",  # plain hyphen
    "Accept-Language": "en-US,en;q=0.9",
}

def url_join(path: str) -> str:
    return up.urljoin(BASE_URL, path)

def fetch(url: str) -> BeautifulSoup:
    """Download and parse one page, retrying once on a 403/503."""
    for attempt in range(2):
        resp = requests.get(url, headers=HEADERS, timeout=30)
        if resp.status_code == 200:
            return BeautifulSoup(resp.text, "html.parser")
        if resp.status_code in (403, 503):
            time.sleep(1)
    resp.raise_for_status()

def extract_links(soup: BeautifulSoup) -> list[str]:
    """Return all in‑doc links that stay inside /autorag/."""
    links: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith(START_PATH):
            links.add(href.split("#", 1)[0])          # strip fragments
        elif href.startswith("/") and "/autorag/" in href:
            links.add(href.split("#", 1)[0])
    return sorted(links)

def extract_article(soup: BeautifulSoup) -> str:
    """
    Cloudflare Docs puts the real content inside <article>.
    We run markdownify on that node only, then trim “Was this helpful?”
    footers Cloudflare injects.
    """
    article = soup.find("article") or soup.find("main") or soup
    md_text = md(str(article), heading_style="ATX")

    # Drop boilerplate starting at the helper footer, if present
    md_text = re.split(r"## Was this helpful\?", md_text)[0].rstrip()
    return md_text + "\n"

def target_path(url_path: str, out_dir: Path) -> Path:
    """
    Convert a URL like /autorag/usage/rest-api/   →  out_dir/usage/rest-api.md
    """
    rel = url_path.removeprefix(START_PATH).rstrip("/")
    if not rel:                       # root index
        return out_dir / "index.md"
    if rel.endswith(".txt"):          # leave raw txt files alone
        return out_dir / rel
    if rel.endswith(".md"):           # already a markdown resource
        return out_dir / rel
    return out_dir / f"{rel}.md"

def crawl(out_dir: Path):
    seen: set[str] = set()
    queue: list[str] = [START_PATH]

    with tqdm(total=0, unit="page") as pbar:
        while queue:
            path = queue.pop(0)
            if path in seen:
                continue
            seen.add(path)

            url  = url_join(path)
            soup = fetch(url)
            md_body = extract_article(soup)

            fp = target_path(path, out_dir)
            fp.parent.mkdir(parents=True, exist_ok=True)
            fp.write_text(md_body, encoding="utf-8")

            pbar.update(1)
            pbar.set_description(f"Saved {path}")

            queue.extend([p for p in extract_links(soup) if p not in seen])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", "-o", default="autorag-docs", help="Output directory")
    args = ap.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    crawl(out_dir)

    print(f"\n✅  Done – markdown saved under {out_dir.resolve()}")

if __name__ == "__main__":
    main()
