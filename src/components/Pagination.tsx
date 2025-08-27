import React from 'react';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
};

const Pagination: React.FC<Props> = ({ page, pageSize, total, onPage }) => {
  const totalPages = Math.ceil(total / pageSize);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || totalPages === 0;

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`pagination-button ${1 === page ? 'active' : ''}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${i === page ? 'active' : ''}`}
          aria-current={i === page ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`pagination-button ${totalPages === page ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} entries
      </div>
      <div className="pagination-buttons">
        <button
          className="pagination-nav-button"
          onClick={() => handlePageChange(1)}
          disabled={isFirstPage}
          aria-label="First page"
        >
          «
        </button>
        <button
          className="pagination-nav-button"
          onClick={() => handlePageChange(page - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          ‹
        </button>
        {renderPageNumbers()}
        <button
          className="pagination-nav-button"
          onClick={() => handlePageChange(page + 1)}
          disabled={isLastPage}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          className="pagination-nav-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Last page"
        >
          »
        </button>
      </div>
      <style>{`
        .pagination-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding: 8px 0;
          width: 100%;
        }
        
        .pagination-info {
          margin-bottom: 8px;
          font-size: 14px;
          color: #666;
        }
        
        .pagination-buttons {
          display: flex;
          gap: 4px;
        }
        
        .pagination-button,
        .pagination-nav-button {
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          margin: 0 2px;
          border: 1px solid #ddd;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .pagination-button:hover:not(:disabled),
        .pagination-nav-button:hover:not(:disabled) {
          background-color: #f0f0f0;
          border-color: #ccc;
        }
        
        .pagination-button.active {
          background-color: #0070f3;
          color: white;
          border-color: #0070f3;
          font-weight: 600;
        }
        
        .pagination-button:disabled,
        .pagination-nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #666;
        }
        
        @media (min-width: 640px) {
          .pagination-container {
            flex-direction: row;
          }
          
          .pagination-info {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;
