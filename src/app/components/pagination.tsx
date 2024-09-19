import React, { useState, useEffect } from 'react';
import { useTheme } from "../components/ThemeContext";

interface PaginationComponentProps<T> {
  data: T[];
  recordsPerPageOptions: number[];
  onPageDataChange: (paginatedData: T[]) => void;
}

const PaginationComponent = <T extends Record<string, any>>({
  data,
  recordsPerPageOptions,
  onPageDataChange,
}: PaginationComponentProps<T>) => {
  const { theadcolor,tbodycolor,isDarkMode} = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(recordsPerPageOptions[0]);
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex =  Math.min(startIndex + recordsPerPage, filteredData.length);
    onPageDataChange(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage, recordsPerPage, onPageDataChange]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredData, currentPage, recordsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };  
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage + 1;
  const endIndex = Math.min(currentPage * recordsPerPage, filteredData.length);
  const paginationButton = (disabled: boolean) => ({
    border: '1px solid #ccc',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled 
    ? (isDarkMode ? tbodycolor : theadcolor) 
    : (isDarkMode ? theadcolor : tbodycolor),

    });

  return (
    <div className="flex justify-between items-center my-5 ">
      <div  className="flex justify-between">
        <label htmlFor="recordsPerPage" className={`mr-2 ml-0 font-roboto text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
          Records per Page:
        </label>
        <select
          id="recordsPerPage"
          value={recordsPerPage}
          onChange={handleRecordsPerPageChange}
          className={`border border-gray-300 rounded p-1 mb-28 text-gray-600 ${isDarkMode ? 'text-white' : ''}`} style={{backgroundColor:theadcolor}}
        >
          {recordsPerPageOptions.map((option) => (
            <option key={option} value={option} className="p-2" > 
              {option} 
            </option>
          ))}
        </select>
      </div>
  
      <div className="flex items-center mr-0 mb-28 text-gray-600">
        {data.length === 0 ? (
          <span className="font-roboto">No records found</span>
        ) : (
          <>
        <span className={`font-roboto ${isDarkMode ? 'text-white' : ''}`}>
        Showing {startIndex} to {endIndex} of {data.length} Results
        </span>
        <button
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1}
          className={`px-2 p-1 mr-2 ml-2 border rounded ${isDarkMode ? 'text-white' : ''}`}
          style={{...paginationButton(currentPage === 1)}}

        >
          &laquo;
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 p-1 mr-2 border rounded ${isDarkMode ? 'text-white' : ''}`}
          style={{...paginationButton(currentPage === 1)}}
        >
          &lsaquo;
        </button>
        <button className={`border border-gray-300 rounded px-2 p-1 bg-[#d3d3d3] cursor-pointer ${isDarkMode ? 'text-white' : ''}`} style={{backgroundColor:theadcolor}}>{currentPage}</button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border rounded px-2 p-1 ml-2 ${isDarkMode ? 'text-white' : ''}`}
          style={{
            ...paginationButton(currentPage === totalPages || endIndex === 0),
            }}

        >
          &rsaquo;
        </button>
        <button
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages}
          className={`border rounded px-2 p-1 ml-2 ${isDarkMode ? 'text-white' : ''}`}
          style={{
            ...paginationButton(currentPage === totalPages || endIndex === 0),
            
          }}

        >
          &raquo;
        </button>
        </>
        )}
      </div>
    </div>
  );
};

export default PaginationComponent;