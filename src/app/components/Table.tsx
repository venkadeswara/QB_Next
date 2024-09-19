"use client";
import { useSortableData } from "./sorting";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PaginationComponent from "./pagination";
import Link from "next/link";
import Select from "react-select";
import FilterAndSortControls from "./tableexclude";
import SpinnerTest from "./spinnerTest";
import { useTheme } from "../components/ThemeContext";
import { toPascalCaseWithSpaces } from "./formatting";
import { usePathname } from "next/navigation";


interface Column {
  Header: string;
  accessor: string;
  isCheckbox?: boolean;
  width?: string;
  centerHeader?: boolean;
}

interface GenericTableProps<T> {
  data: T[];
  isLoading: boolean;
  noDataMessage?: string;
  headers?: string[];
  checkboxcell?: (item: T) => JSX.Element;
  isSelectAllChecked?: boolean;
  onSelectAllChange?: () => void;
  onEditDescription?: (id: number, newDescription: string) => void;
  onFilteredDataChange?: (filteredData: T[]) => void;
}


function GenericTable<T extends Record<string, any>>({
  data,
  isLoading,
  noDataMessage = "No data found",
  headers,
  checkboxcell,
  isSelectAllChecked,
  onSelectAllChange,
  onEditDescription,
  onFilteredDataChange,
}: GenericTableProps<T>) {
  const {theadcolor,tbodycolor ,isDarkMode,tbodyfullcolor} = useTheme();
  const [filterConfig, setFilterConfig] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [paginatedData, setPaginatedData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hasAvailableViews = headers?.includes("Available Views");
  const [records, setRecords] = useState([]);
  const recordsPerPageOptions = hasAvailableViews
    ? [15, 30, 50, 100]: [10, 25, 50, 100];
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const viewId = parseInt(pathParts[2]);
  const id = parseInt(pathParts[4]);
  const [recordsPerPage, setRecordsPerPage] = useState( recordsPerPageOptions[0]);
  const isSpecificPage = location.pathname === "/edit-views";
  const isHistoryPage = location.pathname.includes('/history');
const isSchedulePage = location.pathname.includes('/schedule');
  const handleFilterChange = (key: string, value: string) => {
    setFilterConfig((prevConfig) => ({ ...prevConfig, [key]: value }));
  };
  const applyFilters = useCallback((data: T[]) => {
    let filteredData = data;
    for (let key in filterConfig) {
      if (filterConfig[key]) {
       filteredData = filteredData.filter((item) => {
         const itemValue = item[key];
          if (itemValue != null) {
            return itemValue
              .toString()
              .toLowerCase()
              .includes(filterConfig[key]?.toLowerCase() || "");
          } else {
            return false;
          }
        });
      }
    }
   
    return filteredData;
  },[filterConfig]);
  const filteredData = useMemo(() => applyFilters(data), [data, applyFilters]);
  const defaultSortKey = useMemo(() => {
    if (isHistoryPage) return "Completed At";   
    if (isSchedulePage) return "Next Event";     
    if (isSpecificPage) return "description";   
    return headers && headers.length > 0 ? headers[0] : Object.keys(filteredData[0] || {})[0];
  }, [isHistoryPage, isSchedulePage, isSpecificPage, headers, filteredData]);
  const defaultSortDirection = useMemo(() => {
    if (isHistoryPage && defaultSortKey === "Completed At") return "asc";   
    if (isSchedulePage && defaultSortKey === "Next Event") return "desc";   
    if (isSpecificPage && defaultSortKey === "description") return "asc";   
    return "asc"; 
  }, [isHistoryPage, isSchedulePage, isSpecificPage, defaultSortKey]);
  
  
  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSortableData(filteredData, defaultSortKey);

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setPaginatedData(sortedItems.slice(startIndex, endIndex));
    setCurrentPage(1);
  }, [currentPage, sortedItems, filterConfig, recordsPerPage]);


  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData); 
    }
  }, [filteredData, onFilteredDataChange]);

  const isDateColumn = (accessor: string) => {
    const datecolumn = data[0]?.[accessor];
    return typeof datecolumn === "string" && !isNaN(Date.parse(datecolumn));
  };

  if (isLoading) {
    return <div><SpinnerTest/></div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center mt-60"> <h1 className="text-[#848482]">{noDataMessage}</h1></div>;
  }
  const viewIds = paginatedData.map(item => item.viewId);
  const isFilter = location.pathname === `/queries/${viewIds[0]}`;
  const excludedColumns = isFilter ? ["id", "viewId", "description"] : ["id", "viewId"];
  const nonSortableNonFilterableColumns = [
    "actions",
    "preferences",
    "modify",
    "downloadLink",
    "select",
    "delete",
  ];
  const columns: Column[] =
    headers && headers.length > 0
      ? headers
          .filter((header) => !excludedColumns.includes(header))
          .map((header) => ({
            Header: header,
            accessor: header,
            isCheckbox: header === "select",
            width:
             header === "Filter Name"
                ? "650px"
             : header === "actions"
                ? "6rem"
                : header === "preferences"
                ? "2rem"
                : header === "Completed At"
                ? "4rem"
                : header === "downloadLink"
                ? "6rem"
                : header === "modify" 
                ? "6rem"
                : header === "delete" 
                ? "6rem"
                : "auto",
            centerHeader:
              header === "actions" ||
              header === "preferences" ||
              header === "downloadLink" ||
              header === "modify" ||
              header === "delete",
          }))
      : Object.keys(data[0])
          .filter((key) => !excludedColumns.includes(key))
          .map((key) => ({
            Header: key,
            accessor: key,
            isCheckbox: key === "select",
            width:
             key === "Filter Name"
                ? "650px"
              :key === "actions"
                ? "6rem"
                : key === "preferences"
                ? "2rem"
                : key === "Completed At"
                ? "4rem"
                : key === "downloadLink"
                ? "6rem"
                : key === "modify" 
                ? "6rem"
                : key === "delete" 
                ? "6rem"
                : "auto",
            centerHeader:
              key === "actions" ||
              key === "preferences" ||
              key === "downloadLink" ||
              key === "modify" ||
              key === "delete",
          }));
          const maxHeight = (() => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1880) {
              if (isSpecificPage) {
                return "58vh";
              }
              if (headers?.includes("Available Views")) {
                return recordsPerPage === 15 ? "68vh" : "70vh";
              }
            return "58vh";
            }   
          else if (screenWidth >= 1330) {
              if (isSpecificPage) {
                return "425px";
              }
              if (isFilter) {
                return "447px";
              }
              if(isSchedulePage){
                return "395px"
              }

              if (headers?.includes("Available Views")) {
                return recordsPerPage === 15 ? "470px" : "470px";
              }
              return "390px";
                        }
          })();
          const height = (() => {
            const screenWidth = window.innerWidth;         
            if (screenWidth >= 1880) {
              return "580px";
            } else if (screenWidth >= 1330) {
              if (records.length >= 5) {
                return `${100 + records.length}px`;
              }
 
            }
          })();

  return (
    <div className="m-6">
      <div
        className="overflow-y-auto overflow-x-auto"
        style={{height: isSpecificPage ? "550px" : height, maxHeight: maxHeight,
          scrollbarColor: `${theadcolor} #f1f1f1`}}
      >

      <table className="min-w-full border border-gray-200 ">
        <thead>
          <tr className={`w-full text-gray-600  text-sm bg-[#CECECE] leading-normal ${isDarkMode ? 'text-white' : ''}`} style={{ backgroundColor: theadcolor ,position: "sticky",
            top: 0,
            zIndex: 10}}>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`py-2 px-6 border border-gray-300 font-roboto capitalize ${
                  column.centerHeader ? "text-center" : "text-left"
                }`}
                style={{ width: column.width,
                  height: "auto",
                  whiteSpace: "nowrap",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  paddingLeft: column.centerHeader ? "" : "8px",
                 }}
              >
                <div
                  className={`flex items-center ${
                    column.centerHeader ? "justify-center" : "justify-start"
                  }`}
                  style={{
                    overflow: "visible",
                    flexShrink: 0
                  }}
                >
                  {column.isCheckbox ? (
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={onSelectAllChange}
                      className="ml-4"
                    />
                  ) : (
                    <FilterAndSortControls
                      column={column.Header}
                      filterConfig={filterConfig}
                      handleFilterChange={handleFilterChange}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      isDateColumn={isDateColumn}
                      nonSortableNonFilterableColumns={
                        nonSortableNonFilterableColumns
                      }
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`text-gray-600 text-sm font-light font-roboto bg-[#EEEEEE] whitespace-nowrap ${isDarkMode ? 'text-white' : ''}`} style={{ backgroundColor: tbodycolor }}>
          {paginatedData.map((item, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 ${isDarkMode ? ' text-white hover:bg-[#8c8c8c]' : ' hover:bg-gray-100'}`}
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className={`py-1 px-2 border border-gray-300 ${
                    column.centerHeader ? "text-center" : "text-left"
                  }`}
                  style={{ width: column.width }}
                >
                  {column.accessor === "name" ? (
                    <Select
                      options={data
                        .filter(
                          (_, i, arr) =>
                            arr.findIndex((item) => item.name === _.name) === i
                        )
                        .map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                      defaultValue={{
                        value: item.name,
                        label: item.name,
                      }}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          minWidth: 200,
                        }),
                       
                        menu: (provided) => ({
                          ...provided,
                          minWidth: 200,
                          backgroundColor: isDarkMode ? tbodyfullcolor : provided.backgroundColor,
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? isDarkMode ? '#333333' : '#cccccc' 
                            : isDarkMode ? tbodyfullcolor : provided.backgroundColor,
                          color: state.isSelected ? '#ffffff' : (isDarkMode ? '#fff' : provided.color), 
                          '&:hover': {
                            backgroundColor: state.isSelected
                              ? isDarkMode ? '#333333' : '#cccccc'  
                              : isDarkMode ? '#8c8c8c' : provided.backgroundColor,
                          },
                          '&:active': {
                            backgroundColor: state.isSelected
                              ? isDarkMode ? '#333333' : '#cccccc'
                              : isDarkMode ? tbodyfullcolor : provided.backgroundColor,
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          whiteSpace: "normal",
                          color: isDarkMode ? '#fff' : provided.color, 
                        }),                   
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: 30, 
                          height: 30, 
                          width: 200, 
                          boxShadow: state.isFocused ? 'none' : provided.boxShadow,
                          borderColor: state.isFocused ? (isDarkMode ? '#fff' : '#ccc') : provided.borderColor,
                          backgroundColor: isDarkMode ? tbodycolor : provided.backgroundColor,
                          color: isDarkMode ? '#fffff' : provided.color,
                          '&:hover': {
                            borderColor: '#ccc',
                          },
                        }),                      
                      }}
                    />
                  ): column.accessor === "description" ? (
                    <input
                      type="text"
                      value={item[column.accessor]}
                      onChange={(e) =>
                        onEditDescription && onEditDescription(item.id, e.target.value)
                      }
                      className={`border rounded px-2 py-1 ${
                           isDarkMode ? 'text-white border-white' : 'text-black border-gray-300'
                      }`}
                      style={{ backgroundColor: tbodycolor }}
                    />
                  ) 
                  : column.accessor === "Available Views" ? (
                    <Link href={`/queries/${item.id}`} passHref>
                      {toPascalCaseWithSpaces(item[column.accessor])}
                    </Link>
                  ) : column.accessor === "Filter Name" ? (
                    <Link
                      href={`/queries/${item.viewId}/Filters/${item.id}`}
                      passHref
                    >
                      {toPascalCaseWithSpaces(item[column.accessor])}
                    </Link>
                  ) : column.accessor === "Filter Owner" ? (
                    <Link
                      href={`/queries/${item.viewId}/Filters/${item.id}`}
                      passHref
                    >
                      {toPascalCaseWithSpaces(item[column.accessor])}
                    </Link>
                    ) : column.accessor === "title" ? (
                      <Link
                        href={`/queries/${viewId}/Filters/${id}/Schedule/${item.id}`}
                        passHref
                      >
                        {toPascalCaseWithSpaces(item[column.accessor])}
                      </Link>
                  ) : column.accessor === "Download Link" ? (
                    <a
                      href={item[column.accessor]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "none" }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      Download Results
                    </a>
                  ) : column.accessor === "select" && checkboxcell ? (
                    checkboxcell(item)
                  ) : (
                    toPascalCaseWithSpaces(item[column.accessor])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <PaginationComponent
        data={sortedItems}
        recordsPerPageOptions={recordsPerPageOptions}
        onPageDataChange={setPaginatedData}
      />
    </div>
  );
}

export default GenericTable;
