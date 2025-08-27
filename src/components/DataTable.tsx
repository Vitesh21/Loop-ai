import React from 'react';
import { FixedSizeList as List } from 'react-window';
import type { Row } from '../types';

type Props = {
  rows: Row[];
  columns: string[];
  height: number;
  rowHeight: number;
};

const DataTable: React.FC<Props> = ({ rows, columns, height, rowHeight }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = rows[index];
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #eaeaea',
          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
          fontSize: '14px',
          boxSizing: 'border-box',
          padding: '0 12px'
        }}
      >
        {columns.map((column, colIndex) => (
          <div
            key={`${index}-${column}`}
            style={{
              flex: '1 0 120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '8px 4px',
              boxSizing: 'border-box',
              borderRight: colIndex < columns.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
            title={String(row[column] ?? '')}
          >
            {String(row[column] ?? '')}
          </div>
        ))}
      </div>
    );
  };

  const Header = () => (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#f5f5f5',
        fontWeight: 600,
        fontSize: '14px',
        borderBottom: '2px solid #e0e0e0',
        padding: '8px 12px',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}
    >
      {columns.map((column) => (
        <div
          key={column}
          style={{
            flex: '1 0 120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '0 4px',
            borderRight: columns.indexOf(column) < columns.length - 1 ? '1px solid #e0e0e0' : 'none'
          }}
        >
          {column}
        </div>
      ))}
    </div>
  );

  return (
    <div className="data-table" style={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
      <Header />
      {rows.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No data available</div>
      ) : (
        <List
          height={height - 45} // Subtract header height
          itemCount={rows.length}
          itemSize={rowHeight}
          width="100%"
          style={{ overflowX: 'hidden' }}
        >
          {Row}
        </List>
      )}
    </div>
  );
};

export default DataTable;
