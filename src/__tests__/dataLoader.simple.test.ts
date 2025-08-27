import { loadCsv } from '../utils/dataLoader';
import path from 'path';
import { expect, describe, it } from '@jest/globals';

describe('Data Loader - Simple Tests', () => {
  // Path to the mock dataset
  const mockPath = path.join(process.cwd(), 'public/data/mock/mock_dataset.csv');

  it('should load CSV and return valid data structure', async () => {
    const result = await loadCsv(mockPath);
    
    // Basic structure checks
    expect(result).toHaveProperty('rows');
    expect(result).toHaveProperty('columns');
    expect(Array.isArray(result.rows)).toBe(true);
    expect(Array.isArray(result.columns)).toBe(true);
    
    // Should have at least one row
    if (result.rows.length > 0) {
      const firstRow = result.rows[0];
      // Check that first row is an object with some properties
      expect(typeof firstRow).toBe('object');
      expect(Object.keys(firstRow).length).toBeGreaterThan(0);
    }
  });

  it('should handle non-existent files gracefully', async () => {
    const nonExistentPath = path.join(process.cwd(), 'non-existent-file.csv');
    await expect(loadCsv(nonExistentPath)).rejects.toThrow();
  });
});
