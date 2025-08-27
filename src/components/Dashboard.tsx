import { useState, useEffect, useMemo } from 'react';
import { loadCsv } from '../utils/dataLoader';
import { useFilterWorker } from '../hooks/useFilterWorker';
import FilterDropdown from './FilterDropdown';
import DataTable from './DataTable';
import Pagination from './Pagination';
import type { Row } from '../types';

// Page constants
const PAGE_SIZE = 100; // per requirement
const VISIBLE_RENDER = 20; // virtualization aims to show ~20 visible at once

const Dashboard = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters: column -> selected string values
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { rows: loadedRows, columns: loadedColumns } = await loadCsv('/data/dataset_small.csv');
        setRows(loadedRows);
        setColumns(loadedColumns);
        // Initialize empty filters for each column
        const initialFilters: Record<string, string[]> = {};
        for (const column of loadedColumns) {
          initialFilters[column] = [];
        }
        setFilters(initialFilters);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const { filteredIndices, optionsByColumn, applyFilters } = useFilterWorker(rows, columns);

  // When filters change, send to worker
  useEffect(() => {
    applyFilters(filters);
    setPage(1); // Reset page on filter change
  }, [filters, applyFilters]);

  // Compute filtered rows (we're receiving indices from worker)
  const filteredRows = useMemo(() => {
    return filteredIndices.map(i => rows[i]);
  }, [filteredIndices, rows]);

  const totalFiltered = filteredRows.length;

  // Pagination: take slice of filteredRows for page
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // For DataTable, we pass pageRows (it virtualizes internally)
  const handleChangeFilter = (col: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [col]: values }));
  };

  // For dropdown options, if worker hasn't produced options yet, fallback to all unique values
  const fallbackOptionsByColumn = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const column of columns) {
      const uniqueValues = new Set<string>();
      for (const row of rows) {
        uniqueValues.add(String(row[column]));
      }
      map[column] = Array.from(uniqueValues).sort((a, b) => {
        const numA = Number(a);
        const numB = Number(b);
        if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    }
    return map;
  }, [rows, columns]);

  const optsByColumn = Object.keys(optionsByColumn).length ? optionsByColumn : fallbackOptionsByColumn;

  if (error) {
    return (
      <div className="app">
        <h1>Error</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Filter Optimization - Dashboard</h1>
        <div className="small">Rows: {rows.length} • Filtered: {totalFiltered}</div>
      </div>

      <div className="grid">
        <aside className="sidebar">
          <div className="filter-heading">Filters</div>
          {columns.map((column) => (
            <div key={column} style={{ marginBottom: '10px' }}>
              <FilterDropdown
                column={column}
                options={optsByColumn[column] || []}
                value={filters[column] || []}
                onChange={(values) => handleChangeFilter(column, values)}
                placeholder={`Filter ${column}`}
              />
            </div>
          ))}
        </aside>

        <main className="content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="small">
              Showing page {page} of {totalPages} • {PAGE_SIZE} rows per page
            </div>
            <div className="small">Visible (virtualized) ~{VISIBLE_RENDER} rows</div>
          </div>

          {loading ? (
            <div>Loading data...</div>
          ) : (
            <>
              <DataTable 
                rows={pageRows} 
                columns={columns} 
                height={480} 
                rowHeight={48} 
              />
              <Pagination 
                page={page} 
                pageSize={PAGE_SIZE} 
                total={totalFiltered} 
                onPage={(newPage: number) => setPage(newPage)} 
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
