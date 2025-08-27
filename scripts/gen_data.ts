import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../public/data/mock');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Example mock dataset for testing
const sampleData = [
  ['id', 'number', 'name', 'category', 'price', 'stock', 'lastUpdated'],
  ['1', '1001', 'Product A', 'Electronics', '999.99', '50', '2023-08-27T10:00:00Z'],
  ['2', '1002', 'Product B', 'Clothing', '49.99', '200', '2023-08-26T15:30:00Z'],
  ['3', '1003', 'Product C', 'Home', '199.99', '30', '2023-08-25T09:15:00Z'],
  ['4', '1004', 'Product D', 'Electronics', '299.99', '15', '2023-08-24T14:20:00Z'],
  ['5', '1005', 'Product E', 'Clothing', '29.99', '150', '2023-08-23T11:45:00Z'],
];

fs.writeFileSync(
  path.join(outputDir, 'mock_dataset.csv'),
  sampleData.map(row => row.join(',')).join('\n'),
  'utf-8'
);

console.log('✅ Mock dataset created at', path.join(outputDir, 'mock_dataset.csv'));
