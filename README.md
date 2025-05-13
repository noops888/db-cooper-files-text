# DB Cooper Files Text

A comprehensive archive of FBI documents related to the infamous D.B. Cooper skyjacking case, extracted from the FBI Vault and converted to text.

FBI Vault link: https://vault.fbi.gov/D-B-Cooper%20

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Download Script](#download-script)
  - [Extraction Scripts](#extraction-scripts)
  - [Extracted Text](#extracted-text)
  - [Azure Extraction](#azure-extraction)
  - [Web Chat UI](#web-chat-ui)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview
The D.B. Cooper Files Text repository provides a dataset of FBI case files related to the 1971 D.B. Cooper hijacking incident. It includes raw PDF documents obtained from the FBI Vault, along with scripts to convert these PDFs into plain text for research, analysis, and natural language processing.

## Project Structure

```bash
.
├── download_script/        # Script to download D.B. Cooper PDFs from the FBI Vault
├── extraction_scripts/     # PDF-to-text conversion scripts
│   ├── linux/              # Linux-specific OCR (Tesseract)
│   └── macOS/              # macOS-specific OCR (Apple Vision)
├── extracted_text/         # Extracted text files from PDFs
├── azure/                  # Azure AI Document Intelligence outputs
│   ├── pdf/                # PDF files used for Azure extraction
│   └── json/               # JSON outputs: extracted text, schema, and search backup
└── web-chat-ui/           # Chatbot frontend (Cloudflare Pages + Workers)
```

## Current Status

| Date | Status | Extraction Method | Files Downloaded | Size | Total Files Listed |
|--------------|---------|-------------------|------------------|------|-------------------|
| 2025-05-12 | ✅ Complete | Apple Vision OCR | 106 | 1.86GB | 106 |

## Prerequisites
- Python 3.8+
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) (for Linux scripts)
- macOS 10.15 (Catalina) or later (for Apple Vision scripts)
- Node.js 14+ (for web-chat-ui)
- Wrangler CLI (`npm install -g wrangler`)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/noops888/db-cooper-files-text.git
   cd db-cooper-files-text
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Download Script
To fetch all PDF documents from the FBI Vault:
```bash
python download_script/download_cooper_docs.py
```
_PDFs will be saved in `download_script/pdfs/`._

### Extraction Scripts
Convert PDFs to text:

- **Linux (Tesseract):**
  ```bash
  python extraction_scripts/linux/tesseract_pdf_to_text.py \
    --input download_script/pdfs \
    --output extracted_text
  ```

- **macOS (Apple Vision):**
  ```bash
  python extraction_scripts/macOS/apple_vision_ocr/apple_vision_pdf_to_text_parallel.py \
    --input download_script/pdfs \
    --output extracted_text
  ```

### Extracted Text
Plain text files are generated in `extracted_text/`, named after their source PDF.

### Azure JSON
JSON outputs from Azure AI Document Intelligence are stored in `azure/json/`, including the index schema and search backup.

### Web Chat UI
The `web-chat-ui/` directory contains a Cloudflare Pages site and API Functions for your chatbot.

1. Navigate to the directory and install dependencies:

```bash
cd web-chat-ui
npm install
```

2. Run locally:

```bash
wrangler pages dev
# or
npm run dev
```

3. Open your browser to http://localhost:8787

4. Modify `functions/api/autoragConfig.js` to adjust AI search parameters as needed.

## Contributing
Contributions are welcome! Please open issues or submit pull requests.

1. Fork the repo.
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit your changes.
4. Push and open a PR.

## Azure Extraction
The `azure/` directory contains outputs from Azure AI Document Intelligence:
- `azure/pdf/`: Original PDF files supplied for extraction.
- `azure/json/`: JSON files containing extracted text, index schema, and a backup of search results.

## License
All FBI documents are in the public domain. Scripts and code are licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgements
- [FBI Vault: D.B. Cooper](https://vault.fbi.gov/D-B-Cooper%20)
- Scripts from [jfk-files-text](https://github.com/noops888/jfk-files-text)
