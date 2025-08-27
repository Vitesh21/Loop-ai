import { loadCsv } from '../utils/dataLoader';
import path from 'path';
import { expect, describe, it } from '@jest/globals';
import type { Row } from '../types';

// Make sure this interface matches your actual data structure
interface TestRow extends Row {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  lastUpdated: string;
}

describe('Data Loader', () => {
  const mockPath = path.join(process.cwd(), 'public/data/mock/mock_dataset.csv');

  it('should load CSV into JSON', async () => {
    const result = await loadCsv(mockPath);
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBeGreaterThan(0);
    
    // Safely cast to unknown first, then to TestRow
    const firstRow = result.rows[0] as unknown as TestRow;
    expect(firstRow).toHaveProperty('id');
    expect(firstRow).toHaveProperty('name');
    expect(firstRow).toHaveProperty('category');
    expect(firstRow).toHaveProperty('price');
    expect(firstRow).toHaveProperty('stock');
    expect(firstRow).toHaveProperty('lastUpdated');
  });

  it('should parse numeric and string values correctly', async () => {
    const result = await loadCsv(mockPath);
    const firstItem = result.rows[0] as unknown as TestRow;
    
    // Check types
    expect(typeof firstItem.id).toBe('string');
    expect(typeof firstItem.name).toBe('string');
    expect(typeof firstItem.category).toBe('string');
    expect(typeof firstItem.price).toBe('string');
    expect(typeof firstItem.stock).toBe('string');
    expect(typeof firstItem.lastUpdated).toBe('string');
  });

  it('should throw an error for missing file', async () => {
    await expect(loadCsv('invalid/path.csv')).rejects.toThrow();
  });
});
