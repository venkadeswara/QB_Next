"use client";
import { history } from "@/api/route";
import GenericTable from "@/app/components/Table";
import React, { useEffect, useState } from "react";
import SpinnerTest from "@/app/components/spinnerTest";
import Tooltip from "@/app/components/Tooltip";
import { DownloadIcon } from "@/app/components/svgicons";
import { useTheme } from "@/app/components/ThemeContext";
import { CustomUploadIcon } from "@/app/components/svgicons";


interface HistoryItem {
  id: number;
  title: string;
  downloadLink: string;
  date: string;
  frequency: string;
  schedule: string;
  view: string;
}

const historycolumnname = {
  id: "number",
  title: "Filter",
  downloadLink: "downloadLink",
  date: "Completed At",
  frequency: "Frequency",
  schedule: "Schedule",
  view:"View",
};

function historycolumnmap(item: any): any {
  return {
    [historycolumnname.id]: item.id,
     [historycolumnname.view]: item.view,
    [historycolumnname.title]: item.title,
    [historycolumnname.schedule]: item.schedule,
    [historycolumnname.frequency]: item.frequency,
    [historycolumnname.downloadLink]: (
      
      <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center justify-center  text-[#587d90] ">
        <Tooltip tooltipText="Download" position="right">
        <DownloadIcon/>
        </Tooltip>
        </div>
      </a>
      
    ),
    [historycolumnname.date]: item.date,
  };
}



export default function History() {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode,theadcolor} = useTheme();
  const [filteredData, setFilteredData] = useState<HistoryItem[]>([]);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    async function fetchHistoryData() {
      try {
        const response = await history();
        if (response && Array.isArray(response.items)) {
          const mappedHistory: HistoryItem[] = response.items.map(historycolumnmap)
          mappedHistory.sort((a, b) => {
            const dateDescendingA = a[historycolumnname.date as keyof HistoryItem] as string;
            const dateDescendingB = b[historycolumnname.date as keyof HistoryItem] as string;         
            const dateA = dateDescendingA ? new Date(dateDescendingA) : new Date(0); 
            const dateB = dateDescendingB ? new Date(dateDescendingB) : new Date(0);
          
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              return 0;
            }
            return dateB.getTime() - dateA.getTime();
          });
          setHistoryList(mappedHistory);
        } else {
          setHistoryList([]);
        }
      } catch (error) {
        setHistoryList([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryData();
  }, []);

  if (isLoading) {
    return <div><SpinnerTest/></div>;
  }

  if (historyList.length === 0) {
    return <div><h1 className={`flex items-center justify-center h-screen text-[#848482]  ${isDarkMode ? 'text-white' : ''}`}>No data found</h1></div>;
  }
 const headers = ["View","Filter","Schedule","Frequency","Completed At","downloadLink"];

 const handleFilteredDataChange = (data: HistoryItem[]) => {
  setFilteredData(data);
};
 
 const exportToCSV = (data: HistoryItem[]) => {
  if (data.length === 0) return;
 
  const excludedColumns = ['downloadLink','number'];
  const csvRows: string[] = [];
 
  const headers = Object.keys(data[0])
    .filter(header => !excludedColumns.includes(header));
  csvRows.push(headers.join(','));
 
  for (const row of data) {
    const values = headers.map(header => `"${row[header as keyof HistoryItem] || ''}"`);
    csvRows.push(values.join(','));
  }
 
  const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(csvBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'history.csv';
  a.click();
  URL.revokeObjectURL(url);
};
 
const handleExportClick = () => {
  exportToCSV(filteredData);
};

  return (
    <div className="relative">
    {showTable && (
<>    
  <div className="flex justify-end ">
    <button
      onClick={handleExportClick}
      className={`text-black font-bold mr-6 mt-2  bg-[#CECECE] text-gray-600 py-2 px-2 rounded w-20 h-8 flex items-center justify-center ${
        isDarkMode ? 'text-white' : 'text-gray-600'
        }`} style={{backgroundColor:theadcolor}} >
      <CustomUploadIcon />
      <span className="ml-2 text-sm">Export</span>
    </button>
  </div>
  <div className="-mt-4">
      <GenericTable data={historyList} isLoading={isLoading} headers={headers}
      onFilteredDataChange={handleFilteredDataChange}/>
      </div>
      </>
    )}
  </div>
)};