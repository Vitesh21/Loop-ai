# Loop AI - Data Filtering Dashboard

A high-performance data filtering dashboard built with React, TypeScript, and Vite. This application allows users to load, filter, and explore large datasets with ease.

## Features

- Load and display large CSV datasets
- Real-time filtering with Web Workers for smooth performance
- Virtualized table rendering for efficient display of large datasets
- Responsive design that works on all screen sizes
- Multi-select filters for each column
- Pagination for easy navigation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vitesh21/Loop-ai.git
   cd Loop-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `/public` - Static files including sample datasets
- `/src` - Source code
  - `/components` - Reusable React components
  - `/hooks` - Custom React hooks
  - `/utils` - Utility functions
  - `/workers` - Web Workers for background processing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
