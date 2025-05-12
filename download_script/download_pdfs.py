#!/usr/bin/env python3
import argparse
import os
import requests
import re
from urllib.parse import urlparse, unquote

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
    'Accept': 'application/pdf',
    'Referer': 'https://vault.fbi.gov/'
}

def get_pdf_links(file_path):
    # Read each line and treat non-empty http(s) lines as URLs
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
    return [line.strip() for line in lines if line.strip().startswith(('http://','https://'))]

def download_file(url, output_dir):
    parsed = urlparse(url)
    decoded_path = unquote(parsed.path)
    # derive filename by extracting part number
    match = re.search(r'Part\s*(\d+)', decoded_path)
    if match:
        num = int(match.group(1))
        filename = f"cooper_d_b_part{num:03d}.pdf"
    else:
        seg = decoded_path.rstrip('/').split('/')[-1]
        filename = seg if seg.lower().endswith('.pdf') else f"{seg}.pdf"
    dest = os.path.join(output_dir, filename)
    resp = requests.get(url, headers=HEADERS, stream=True)
    # if forbidden or not found, try alternate URL
    if resp.status_code in (403, 404):
        if url.endswith('/at_download/file'):
            alt_url = url[:-len('/at_download/file')] + '.pdf'
        else:
            alt_url = url + '/at_download/file'
        print(f"Primary URL returned {resp.status_code}; trying alternative: {alt_url}")
        resp = requests.get(alt_url, headers=HEADERS, stream=True)
    resp.raise_for_status()
    with open(dest, 'wb') as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)
    print(f"Downloaded: {url} -> {dest}")

def main():
    parser = argparse.ArgumentParser(description='Download all PDF files linked or reconstruct FBI vault URLs')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-i','--input-file',dest='input_file',help='Path to text file containing URLs')
    group.add_argument('-r','--reconstruct',action='store_true',help='Generate FBI vault file URLs')
    parser.add_argument('--start',type=int,default=1,help='Start part number (reconstruct mode)')
    parser.add_argument('--end',type=int,default=106,help='End part number (reconstruct mode)')
    parser.add_argument('output_dir',nargs='?',default='pdfs',help='Directory to save downloaded PDFs')
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    if args.reconstruct:
        links = [f"https://vault.fbi.gov/D-B-Cooper%20/D.B.%20Cooper%20Part%20{num:03d}/at_download/file" for num in range(args.start, args.end+1)]
    else:
        if not os.path.isfile(args.input_file):
            print(f"Input file not found: {args.input_file}")
            return
        links = get_pdf_links(args.input_file)
    if not links:
        print('No PDF links found.')
        return

    for url in links:
        try:
            download_file(url, args.output_dir)
        except Exception as e:
            print(f"Error downloading {url}: {e}")

if __name__ == '__main__':
    main()
