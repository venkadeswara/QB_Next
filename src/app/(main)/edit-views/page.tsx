"use client";
import { EditViewsDelete, views } from "@/api/route";
import GenericTable from "@/app/components/Table";
import { useEffect, useState } from "react";
import React from "react";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import SpinnerTest from "@/app/components/spinnerTest";
import { useTheme } from "@/app/components/ThemeContext";
import { CancelIcon, SaveIcon, PlusIcon, DeleteIcon, OkIcon } from "@/app/components/svgicons";
import Tooltip from "@/app/components/Tooltip";

interface editviewItem {
  name: string;
  addedOn: string;
  lastModifiedBy: string;
  addedBy: string;
  lastModifiedOn: string;
  description: string;
  id: number;
}

const editcolumnname = {
  name: "name",
  addedOn: "Added On",
  addedBy: "Added By",
  lastModifiedOn: "Last Modified On",
  lastModifiedBy: "Last Modified By",
  description: "description",
  id: "id",
};

function editcolumnmap(item: any): any {
  return {
    [editcolumnname.name]: item.name,
    [editcolumnname.addedOn]: formatCustomDate(item.addedOn),
    [editcolumnname.addedBy]: item.addedBy,
    [editcolumnname.lastModifiedOn]: formatCustomDate(item.lastModifiedOn),
    [editcolumnname.lastModifiedBy]: item.lastModifiedBy,
    [editcolumnname.description]: toPascalCaseWithSpaces(item.description),
    [editcolumnname.id]: item.id,
  };
}

function formatCustomDate(dateObj: any): string {
  const {
    year,
    monthOfYear,
    dayOfMonth,
    hourOfDay,
    minuteOfHour,
    secondOfDay,
    millisOfDay,
  } = dateObj;
  const date = new Date(
    year,
    monthOfYear - 1,
    dayOfMonth,
    hourOfDay,
    minuteOfHour,
    secondOfDay % 60,
    millisOfDay % 1000
  );
  const formattedDate = `${date.getFullYear()}-${padZero(
    date.getMonth() + 1
  )}-${padZero(date.getDate())}`;
  const hours12 = hourOfDay % 12 || 12;
  const amPm = hourOfDay >= 12 ? "PM" : "AM";
  const formattedTime = `${padZero(hours12)}:${padZero(
    date.getMinutes()
  )}:${padZero(date.getSeconds())} ${amPm}`;
  return `${formattedDate} ${formattedTime}`;
}
function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}

export default function Editview() {
  const [editviewList, setEditViewList] = useState<editviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { isDarkMode} = useTheme();
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  useEffect(() => {
    async function fetchEditviewsData() {
      try {
        const response = await views();
        if (response && Array.isArray(response)) {
          const mappedEditviews: editviewItem[] = response.map(editcolumnmap);
          const sortedEditviews = mappedEditviews.sort((a, b) => 
            a.description.localeCompare(b.description)
          );
          
          setEditViewList(mappedEditviews);
        } else {
          setEditViewList([]);
        }
      } catch (error) {
        setEditViewList([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEditviewsData();
  }, []);

  const handleSelectAllChange = () => {
    const newCheckedState = !isSelectAllChecked;
    setIsSelectAllChecked(newCheckedState);
    const newCheckedItems = editviewList.reduce((acc, item) => {
      acc[item.id] = newCheckedState;
      return acc;
    }, {} as Record<number, boolean>);
    setCheckedItems(newCheckedItems);
    setIsDeleteDisabled(!newCheckedState);
  };
  const handleDescriptionChange = (id: number, newDescription: string) => {
    setEditViewList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, description: newDescription } : item
      )
    );
    setCheckedItems((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleItemCheckboxChange = (id:number) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
      ...prevCheckedItems,
      [id]: !prevCheckedItems[id],
    };
    const isAnyItemChecked = Object.values(updatedCheckedItems).some(
      (isChecked) => isChecked
    );
    setIsDeleteDisabled(!isAnyItemChecked);
    return updatedCheckedItems;
  });
};

  const handleDelete = () => {
    const selectedIds = Object.keys(checkedItems).filter(
      (id) => checkedItems[parseInt(id)]
    );

    if (selectedIds.length > 0) {
      setPopupMessage(`Are you sure you want to delete these ${selectedIds.length} items?`);
      setIsDeletePopupVisible(true);
    } 
    setSelectedId(selectedId);
}

const handleConfirmDelete = async () => {
  const selectedIds = Object.keys(checkedItems)
  .filter((id) => checkedItems[parseInt(id)]) 
  .map((id) => parseInt(id));


  if (selectedIds.length > 0) {
    try {
      const result = await EditViewsDelete(selectedIds);
      console.log(result);

      if (result === 200) {
        setPopupMessage("Successfully deleted");       
        setEditViewList((prevList) =>
          prevList.filter((item) =>  !selectedIds.includes(item.id))
        );
      } else {
        setPopupMessage("Failed to delete");
      }
      setIsDeletePopupVisible(false);
      setCheckedItems({});
      setIsSelectAllChecked(false);
      setIsDeleteDisabled(true);
    } catch (error) {
      console.error("Error deleting item:", error);
      setPopupMessage("Failed to delete due to an error");
    } finally {
      setIsModalOpen(true);
    }
  }
};

const handleCancelDelete = () => {
  setIsDeletePopupVisible(false);
};

const handleClosePopup = () => {
  setIsModalOpen(false);
};

  const headers = [
    "select",
    "description",
    "name",
    "Added By",
    "Added On",
    "Last Modified By",
    "Last Modified On",
  ];

  if (isLoading) {
    return <div><SpinnerTest/></div>;
  }

  if (editviewList.length === 0) {
    return <div><h1 className={`flex items-center justify-center h-screen text-[#848482]  ${isDarkMode ? 'text-white' : ''}`} >No data found</h1></div>;
  }

  return (
    <div>
      <div className="flex justify-end mr-7 mt-2 ">
  
  <button className="px-2 py-1 text-[#b9cbba] h-8 w-8 items-center flex justify-center text-sm">
    <Tooltip tooltipText="Add">
      <PlusIcon />
    </Tooltip>
  </button>

  <button className={`px-2 py-1 ${isDeleteDisabled ? 'text-[#b9cbba]' : 'text-[#cd9898]'}`}
  onClick={handleDelete}
  style={{
    cursor: isDeleteDisabled ? 'not-allowed' : 'pointer',
    opacity: isDeleteDisabled ? 0.5 : 1,
  }}
  disabled={isDeleteDisabled}
  >
    <Tooltip tooltipText="Delete">
      <DeleteIcon />
    </Tooltip>
  </button>

  <button className="text-[#848482] px-2 py-1">
    <Tooltip tooltipText="Cancel">
      <CancelIcon className="w-4 h-4" />
    </Tooltip>
  </button>
  
  <button className="text-[#b9cbba] px-2 py-1 rounded flex items-center">
    <Tooltip tooltipText="Save">
      <SaveIcon />
    </Tooltip>
  </button>

</div>
<div className="-mt-4">
      <GenericTable
        data={editviewList}
        isLoading={isLoading}
        headers={headers}
        checkboxcell={(item) => {
          return (
            <input
              type="checkbox"
              className="ml-4"
              checked={!!checkedItems[item.id]}
              onChange={() => handleItemCheckboxChange(item.id)}
            />
          );
        }}
        isSelectAllChecked={isSelectAllChecked}
        onSelectAllChange={handleSelectAllChange}
        onEditDescription={handleDescriptionChange}
      />
    </div>
    {isDeletePopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-8" style={{ width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
            <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Confirm Delete</h2>
            <p className={`${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>{popupMessage}</p>
            <br />
             <div className="absolute bottom-4 right-4 flex space-x-4">
             <button
                onClick={handleCancelDelete}
                className="px-4 py-2  bg-transparent text-[#848482]"
              >
                <Tooltip tooltipText="Cancel">
                  <CancelIcon />
                </Tooltip>
              </button>
              <button
                onClick={ handleConfirmDelete}
                className="px-4 py-2  bg-transparent text-[#cd9898]  "
              >
                <Tooltip tooltipText="Delete">
                  <DeleteIcon />
                </Tooltip>
              </button>
              
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="flex items-center justify-center fixed inset-0  bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-8" style={{width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Success Message</h2>
              <h3 className={`font-roboto text-lg font-lite leading-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                Successfully Deleted
              </h3>
              <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
            onClick={handleClosePopup}
            className={`bg-transparent font-medium px-4 py-2 rounded absolute bottom-4 right-8 ${isDarkMode ? 'text-white' : ''}`}>
            <Tooltip tooltipText="Ok">
              <OkIcon color="#89c78d"/>
            </Tooltip>
          </button>
          </div>
            </div>
          </div>

      )}
    </div>
  );
}
