# LaTeX PDF MCP Server

[![MCP](https://img.shields.io/badge/MCP-compatible-6E56CF)](https://modelcontextprotocol.io)

A [Model Context Protocol](https://modelcontextprotocol.io) server that converts LaTeX source code into PDF documents using a local LaTeX distribution. It lets AI assistants generate professional, typeset PDFs - academic papers, reports, resumes - from LaTeX markup.

## Features

- **LaTeX to PDF conversion** via `latexmk -pdf`
- **Full LaTeX support**: math, tables, figures, bibliographies, cross-references
- **Configurable output directory** through `LATEXPDF_OUTPUT_DIR`
- **Download links** for generated PDFs (served over local HTTP)
- **Detailed error reporting** for LaTeX compilation failures

## Prerequisites

1. **Node.js** 18 or higher
2. **A LaTeX distribution** with `latexmk` available on your `PATH`:
   - Windows: [MiKTeX](https://miktex.org/) or [TeX Live](https://www.tug.org/texlive/)
   - macOS: [MacTeX](https://www.tug.org/mactex/)
   - Linux: TeX Live (e.g. the `texlive-full` package)

## Installation

### From npm

```bash
npm install -g latexpdf-mcp
```

### From source

```bash
git clone https://github.com/tobioffice/LateXPDF-MCP.git
cd LateXPDF-MCP
pnpm install
pnpm run build
```

## Configuration

### Claude Desktop

Config file locations:

- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "latexpdf-mcp": {
      "command": "latexpdf-mcp",
      "env": {
        "LATEXPDF_OUTPUT_DIR": "/path/to/your/pdf/directory"
      }
    }
  }
}
```

| Environment variable | Default | Description |
| --- | --- | --- |
| `LATEXPDF_OUTPUT_DIR` | `C:\Users\Admin\Documents\GeneratedPDF` | Directory where the generated `.tex` and `.pdf` files are written |

Always set `LATEXPDF_OUTPUT_DIR` to a directory that exists on your machine. When using Windows paths in JSON, escape the backslashes (`C:\\Users\\YourName\\PDFs`).

## Usage

### Tool: `create_pdf`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `file_name` | string | yes | Output file name, must end with `.pdf` |
| `latex_source` | string | yes | LaTeX source code to compile |

Example LaTeX source:

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\title{Sample Document}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
This is a sample LaTeX document generated via MCP.

\subsection{Features}
\begin{itemize}
  \item Professional formatting
  \item Mathematical expressions: $E = mc^2$
  \item Cross-references and citations
\end{itemize}

\end{document}
```

The tool returns the output file name and a download link:

```text
File Name: report.pdf

PDF Download LINK: http://localhost:8000/report.pdf
```

### Accessing generated PDFs

Serve the output directory over HTTP and open the link:

```bash
python -m http.server 8000 --directory "$LATEXPDF_OUTPUT_DIR"
```

## Development

```bash
pnpm run build   # compile TypeScript to dist/
pnpm run watch   # compile in watch mode
```

### Project structure

```text
LateXPDF-MCP/
├── index.ts              # MCP server implementation
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
└── scripts/
    └── update-version.js # Syncs the version string in index.ts
```

## Troubleshooting

- **`latexmk` not found** - make sure your LaTeX distribution is installed and on your `PATH`
- **Permission errors** - check write access to `LATEXPDF_OUTPUT_DIR`
- **Compilation failed / no output PDF** - check the LaTeX source for errors and missing packages
- **Invalid input** - `file_name` must end with `.pdf`

## Acknowledgments

Based on [latexpdf-mcp](https://github.com/ihor-sokoliuk/latexpdf-mcp) by Ihor Sokoliuk.

## License

MIT (as declared in `package.json`).
