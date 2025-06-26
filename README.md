# LaTeX PDF MCP Server

A Model Context Protocol (MCP) server that provides tools for converting LaTeX source code into PDF documents. This server enables AI assistants to generate high-quality PDF documents from LaTeX markup with professional formatting capabilities.

## Features

- **LaTeX to PDF Conversion**: Convert LaTeX source code directly to PDF format
- **Professional Document Generation**: Supports all standard LaTeX features for academic and professional documents
- **Local File Generation**: Creates PDF files in a specified directory for easy access
- **HTTP Server Integration**: Generates downloadable links for created PDFs
- **Error Handling**: Comprehensive error reporting for LaTeX compilation issues

## Prerequisites

Before using this MCP server, ensure you have:

1. **Node.js** (version 18 or higher)
2. **LaTeX Distribution**: A complete LaTeX installation such as:
   - **Windows**: [MiKTeX](https://miktex.org/) or [TeX Live](https://www.tug.org/texlive/)
   - **macOS**: [MacTeX](https://www.tug.org/mactex/)
   - **Linux**: TeX Live (install via package manager)
3. **latexmk**: Usually included with LaTeX distributions

## Installation

### From npm (Recommended)

```bash
npm install -g latexpdf-mcp
```

### From Source

1. Clone the repository:

```bash
git clone https://github.com/ihor-sokoliuk/latexpdf-mcp.git
cd latexpdf-mcp
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm run build
```

## Configuration

### Claude Desktop Configuration

Add the server to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

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

### Output Directory

By default, PDFs are generated in: `C:\Users\Admin\Documents\GeneratedPDF`

You can customize the output directory by setting the `LATEXPDF_OUTPUT_DIR` environment variable in your MCP configuration.

**Example configurations:**

**Windows:**

```json
{
  "mcpServers": {
    "latexpdf-mcp": {
      "command": "latexpdf-mcp",
      "env": {
        "LATEXPDF_OUTPUT_DIR": "C:\\Users\\YourName\\Documents\\MyPDFs"
      }
    }
  }
}
```

**macOS/Linux:**

```json
{
  "mcpServers": {
    "latexpdf-mcp": {
      "command": "latexpdf-mcp",
      "env": {
        "LATEXPDF_OUTPUT_DIR": "/home/yourname/Documents/PDFs"
      }
    }
  }
}
```

## Usage

Once configured, you can use the server through your MCP-compatible client:

### Available Tools

#### `create_pdf`

Converts LaTeX source code into a PDF document.

**Parameters:**

- `file_name` (string, required): Name of the output PDF file (must end with .pdf)
- `latex_source` (string, required): LaTeX source code to convert

**Example:**

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

## PDF Access

After generating a PDF, you can access it via HTTP server:

1. Navigate to the output directory (default: `C:\Users\Admin\Documents\GeneratedPDF`, or your custom `LATEXPDF_OUTPUT_DIR`):

```bash
cd [YOUR_OUTPUT_DIRECTORY]
```

2. Start a local HTTP server:

```bash
python -m http.server
```

3. Access your PDFs at `http://localhost:8000/[filename].pdf`

The server automatically provides download links in this format when PDFs are generated.

## Development

### Project Structure

```
latexpdf-mcp/
├── index.ts              # Main server implementation
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── pnpm-lock.yaml        # Dependency lock file
└── dist/                 # Compiled JavaScript output
```

### Building

```bash
pnpm run build
```

### Development Mode

```bash
pnpm run watch
```

## Troubleshooting

### Common Issues

1. **LaTeX not found**: Ensure LaTeX is properly installed and `latexmk` is in your PATH
2. **Permission errors**: Check write permissions for the output directory
3. **Compilation errors**: Review LaTeX syntax and required packages

### Error Messages

The server provides detailed error messages for:

- Missing LaTeX installation
- Compilation failures
- File system permissions
- Invalid input parameters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

- **Repository**: [https://github.com/ihor-sokoliuk/latexpdf-mcp](https://github.com/ihor-sokoliuk/latexpdf-mcp)
- **Issues**: [https://github.com/ihor-sokoliuk/latexpdf-mcp/issues](https://github.com/ihor-sokoliuk/latexpdf-mcp/issues)
- **Model Context Protocol**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)

## Author

**Ihor Sokoliuk** - [GitHub Profile](https://github.com/tobioffice)

---

_This MCP server enables seamless LaTeX to PDF conversion within AI-assisted workflows, perfect for generating academic papers, technical documentation, and professional reports._
