# Azure Tenant ID Lookup Tool

A modern web application that helps users find Azure Tenant IDs for multiple domains. The tool supports both single domain lookups and bulk processing through file uploads.

## Features

- Single domain lookup with instant results
- Bulk domain processing via CSV or TXT file upload (up to 200 domains)
- Drag and drop file upload support
- Responsive table with sorting and searching capabilities
- Progress tracking for bulk operations
- Export results to CSV
- Modern, clean UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/azure-tenant-lookup.git
cd azure-tenant-lookup
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

### Single Domain Lookup

1. Navigate to the "Single Domain Lookup" tab
2. Enter a domain name (e.g., "microsoft.com")
3. Click "Lookup Tenant ID"
4. View the results in the table below

### Bulk Domain Lookup

1. Navigate to the "Bulk Upload" tab
2. Either:
   - Drag and drop a CSV/TXT file onto the upload area
   - Click to browse and select a file
3. Wait for the processing to complete
4. View all results in the table below

### File Format Requirements

- CSV files: One domain per row/column
- TXT files: One domain per line
- Maximum 200 domains per file
- Domains can be with or without ".com" (will be automatically normalized)

## Technical Details

- Built with React and TypeScript
- Uses Tailwind CSS for styling
- Implements parallel processing with batched requests
- No backend required - communicates directly with Microsoft's OpenID endpoints
- Responsive design that works on all device sizes

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 