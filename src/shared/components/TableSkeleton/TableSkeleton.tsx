import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 8, columns = 6 }) => {
  return (
    <div className="rounded-lg bg-white shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex px-6 py-3 gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-gray-200 animate-pulse"
              style={{ width: i === columns - 1 ? '5rem' : i === 0 ? '8rem' : `${60 + ((i * 7) % 60)}px` }}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 bg-white flex-1 overflow-hidden">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center px-6 py-4 gap-6">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-4 rounded bg-gray-100 animate-pulse"
                style={{
                  width:
                    colIdx === columns - 1
                      ? '5rem'
                      : colIdx === 0
                        ? '8rem'
                        : `${60 + ((rowIdx * 3 + colIdx * 7) % 60)}px`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="shrink-0 flex items-center justify-center gap-4 border-t border-gray-200 px-6 py-4">
        <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
};

export default TableSkeleton;
