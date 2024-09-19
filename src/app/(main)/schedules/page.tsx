"use client";
import { Schedule,ScheduleDelete } from "@/api/route";
import GenericTable from "@/app/components/Table";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan,  faCheck } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import SpinnerTest from "@/app/components/spinnerTest";
import { CustomUploadIcon,ModifyIcon,DeleteIcon } from "@/app/components/svgicons";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import Tooltip from "@/app/components/Tooltip";
import { useTheme } from "@/app/components/ThemeContext";

interface ScheduleItem {
  id: number;
  viewId: number;
  filterId: number;
  title: string;
  viewDescription: string;
  filterName: string;
  frequency: string;
  nextEvent: string;
  modify: JSX.Element;
  viewName: string;
  delete: JSX.Element;
}


const Schedules = () => {
 const [filteredData, setFilteredData] = useState<ScheduleItem[]>([]);
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode,theadcolor} = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalIsOpen, setIsModalIsOpen] = useState(false);
  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await Schedule();
        if (response && Array.isArray(response.items)) {
          const mappedSchedule: ScheduleItem[] = response.items.map(
            (item: any) => ({
              id: item.id,
              "View": item.viewDescription,
              "Filter": item.filterName,
              "Schedule": item.title,
              Frequency: item.frequency,
              "Next Event": format(
                new Date(item.nextEvent),
                "MM/dd/yyyy, hh:mm:ss a"
              ),  
              modify: (
                <button
                  onClick={() => handleTable(
                    item.id, 
                    item.viewId, 
                    item.filterId, 
                   
                  )}
                  className="px-1 py-1 text-[#587d90]"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <Tooltip tooltipText="Modify" position="right">
                 <ModifyIcon />
                 </Tooltip>
                </button>
              ),
              delete: (
                <button
                onClick={() => handleDeleteClick(item)}
                className="px-4 py-1 text-[#ad6767] "
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                <Tooltip tooltipText="Delete" position="right">
                <DeleteIcon/>
                </Tooltip>
                </button>
              ),
              })
          );
          
          setScheduleList(mappedSchedule);
        } else {
          setScheduleList([]);
        }
      } catch (error) {
        setScheduleList([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchScheduleData();
  }, []);
  const handleFilteredDataChange = (data: ScheduleItem[]) => {
    setFilteredData(data);
  };

  const handleTable =(id:number,viewId:number,filterId:number)=>{
    window.location.href = `/queries/${viewId}/Filters/${filterId}/Schedule/${id}`;  
  }
  const exportToCSV = (data: ScheduleItem[]) => {
    if (data.length === 0) return;

    const excludedColumns = ['modify', 'delete'];
    const csvRows: string[] = [];

    const headers = Object.keys(data[0])
      .filter(header => !excludedColumns.includes(header));
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => `"${row[header as keyof ScheduleItem] || ''}"`);
      csvRows.push(values.join(','));
    }
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedules.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (item: ScheduleItem) => {
    setIsModalVisible(true);
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const { id, viewId, filterId } = itemToDelete;
 
      const result = await ScheduleDelete(id,viewId,filterId);
      if (result === 200) {
        setScheduleList(prevData => {          
          const updatedData = prevData.filter(data => {             
             return data.id !== id});            
           return updatedData;
         });
        setIsModalOpen(true)
      } else {
        setIsModalIsOpen(true)
      }
      setIsModalVisible(false);
      setItemToDelete(null);
    }
  };
  const closeModal = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };
  const handleClosePopup = () => {
    setIsModalIsOpen(false);
    setIsModalOpen(false);
  };
  const handleExportClick = () => {
    exportToCSV(filteredData);
  };

  if (isLoading) {
    return <div><SpinnerTest/></div>;
  }

  if (scheduleList.length === 0) {
    return <div><h1 className={`flex items-center justify-center h-screen text-[#848482] ${isDarkMode ? 'text-white' : ''}`}>No data found</h1></div>;
  }

  return (
    <div className="relative">
    <div className="flex justify-end ">
      <button
        onClick={handleExportClick}
        className={`text-black font-bold mr-6 mt-2  bg-[#CECECE] text-gray-600 py-2 px-2 rounded w-20 h-8 flex items-center justify-center
        ${
          isDarkMode ? 'text-white' : 'text-gray-600'
          }`} style={{backgroundColor:theadcolor}} >
        <CustomUploadIcon />
        <span className="ml-2 text-sm">Export</span>
      </button>
    </div>
    <div className="-mt-4">
    <GenericTable data={scheduleList} isLoading={isLoading} 
       onFilteredDataChange={handleFilteredDataChange}
      />
    </div>
    {isModalOpen && (
      <div className="flex items-center justify-center fixed inset-0  bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-8 font-roboto" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Success Message</h2>
              <h3 className={`text-lg font-lite leading-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                Successfully Deleted
              </h3>
              <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
            onClick={handleClosePopup}
            className="bg-transparent text-[#b9cbba] font-medium px-4 py-2 rounded absolute bottom-4 right-8">
            <Tooltip tooltipText="Ok">
              <FontAwesomeIcon icon={faCheck} className={`ml-2  ${isDarkMode ? 'text-white' : ''}`} />
            </Tooltip>
          </button>
          </div>
            </div>
          </div>
    )}
     {isModalIsOpen && (
 <div className="flex items-center justify-center fixed inset-0   bg-black bg-opacity-50 z-50 ">
 <div className="flex p-3 items-center justify-center font-roboto">
   <div className="relative bg-white rounded-lg p-8 " style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
     <h2 className={`ml-3 text-left text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Access Denied !</h2>
     <h3 className={`p-4 text-lg font-lite leading-6  ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
      Error deleting schedule. Please try again later
     </h3> 
     <div className="absolute bottom-4 right-4 flex space-x-4">
     <button
            onClick={handleClosePopup}
            className="bg-transparent text-[#b9cbba] font-medium px-4 py-2 rounded absolute bottom-4 right-8">
            <Tooltip tooltipText="Ok">
              <FontAwesomeIcon icon={faCheck} className={`ml-2  ${isDarkMode ? 'text-white' : ''}`} />
            </Tooltip>
          </button>
          </div>
   </div>
 </div>
</div> 
    )}

    {isModalVisible && itemToDelete && (
  <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-50">
    <div className="relative bg-white rounded-lg p-8" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
      <h2 className={`text-lg font-bold mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>Confirm Delete</h2>
      <p className={`mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}` } style={{ wordWrap: 'break-word' }}>Are you sure you want to delete the schedule {toPascalCaseWithSpaces(itemToDelete?.title)}</p>
      <div className="absolute bottom-4 right-4 flex space-x-4">
      <button
          className="px-4 py-2 bg-transparent text-[#99b99b]"
          onClick={confirmDelete}
        >
          <Tooltip tooltipText="Ok">
          <FontAwesomeIcon icon={faCheck} className={`w-6 h-6 ${isDarkMode ? 'bg-black-200 r-2 text-white  ' : ''}`} />
          </Tooltip>
        </button>
        <button
          className="mr-4 px-4 py-2 bg-transparent text-[#686866]"
          onClick={closeModal}
        >
          <Tooltip tooltipText="Cancel">
        <FontAwesomeIcon icon={faBan} className={`w-5 h-5 ${isDarkMode ? 'bg-black-200 r-2 text-white  ' : ''}`} />
        </Tooltip>
        </button>
      </div>
    </div>
  </div>
)}	
  </div>
);
};

export default Schedules;
