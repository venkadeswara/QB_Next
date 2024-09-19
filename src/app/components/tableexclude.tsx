import React from "react";
import Filter from "./filter";
import Tooltip from "./Tooltip";
import { useTheme } from "./ThemeContext";

interface FilterAndSortControlsProps<T> {
  column: string;
  filterConfig: Record<string, string>;
  handleFilterChange: (key: string, value: string) => void;
  activeFilter: string | null;
  setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>;
  requestSort: (key: keyof T) => void;
  sortConfig: { key: keyof T; direction: string } | null;
  isDateColumn: (accessor: string) => boolean;
  nonSortableNonFilterableColumns: string[];
}

function FilterAndSortControls<T>({
  column,
  filterConfig,
  handleFilterChange,
  activeFilter,
  setActiveFilter,
  requestSort,
  sortConfig,
  isDateColumn,
  nonSortableNonFilterableColumns,
}: FilterAndSortControlsProps<T>) {
  const shouldRenderControls = !nonSortableNonFilterableColumns.includes(column);
  const {isDarkMode}=useTheme();

  return (
    <div className="flex items-center">
      <span>{column}</span>
      {shouldRenderControls && (
        <>         
           <Tooltip tooltipText="Sort by">
          <span
            className="ml-1 text-gray-400 cursor-pointer text-lg font-light leading-none"
            style={{ color: isDarkMode ? "#FFFFFF" : "#7f848a" }}
            onClick={() => requestSort(column as keyof T)}
          >
            {column === sortConfig?.key
              ? isDateColumn(column)
                ? sortConfig.direction === "descending"
                  ? "↑"
                  : "↓"
                : sortConfig.direction === "ascending"
                ? "↑"
                : "↓"
              : "↑↓"}
          </span>
          </Tooltip>

          <Filter
            header={column}
            filterConfig={filterConfig}
            handleFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </>
      )}
    </div>
  );
}

export default FilterAndSortControls;
