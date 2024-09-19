"use client";
import { Fillters, Modified, Modify, ScheduleDelete, view } from "@/api/route";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SpinnerTest from "@/app/components/spinnerTest";
import { useTheme } from "@/app/components/ThemeContext";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import { faCancel, faFloppyDisk, faTrash,faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@/app/components/Tooltip";
import { CancelIcon, DeleteIcon, SaveIcon } from "@/app/components/svgicons";

interface CheckschedulesItem {
    id: number;
    title: string;
    description: string;
    email: string;
    contactId: number;
    frequency: string;
    active: boolean;

}
interface Payload {
    id: number | null;
    frequency: string;
    emailEmptyResultSet: boolean;
    title: string;
    description: string;
    toEmailAddresses: string;
    startDate: string;
    endDate: string;
    month?: string;
    hour: string;
    minute: string;
    day?: string;
    dom?: string
}

interface Payloads {
    id: number | null;
    viewId: number | null;
    filterId: number | null,
    active?: boolean;
    addContactId?: number | null;
    addDttm?: string | null;
    day?: string | null;
    month?: string;
    description: string;
    dom?: string | null;
    emailEmptyResultSet: boolean;
    emailLink?: boolean;
    emailSubject?: string | null;
    endDate: string;
    frequency: string;
    hour: string;
    minute: string;
    modifiedContactId?: number | null;
    modifiedDttm?: string | null;
    originator?: string | null;
    querySql?: string | null;
    startDate: string;
    status?: string | null;
    title: string;
    toEmailAddresses: string;

}

interface ViewData {
    description: string;
    columnName: string;
    dataType: string;
}
interface FilterData {
    id: number;
    description: string;
    name: string;
}


export default function Schedules() {
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const viewId = parseInt(pathParts[2], 10);
    const id = parseInt(pathParts[4], 10);
    const sid = parseInt(pathParts[6], 10);
    const [checkscheduleList, setCheckscheduleList] = useState<CheckschedulesItem[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<CheckschedulesItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedButton, setSelectedButton] = useState('ONETIME');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [emailEmptyResultSet, setEmailEmptyResultSet] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [hour, setHour] = useState('0');
    const [minute, setMinute] = useState('0');
    const [endDate, setEndDate] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('');
    const { theadcolor,tbodycolor,color, isDarkMode } = useTheme();
    const [header, setHeader] = useState<ViewData[]>([]);
    const [viewhead, setViewHead] = useState<FilterData | null>(null);
    const [PERIODIC, setYEARLY] = useState('');
    const [month, setMonth] = useState('');
    const [inputType, setInputType] = useState('text');
    const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [modifySchedule, setModifySchedule] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const validateEmails = (emails: string) => {
        if (emails.trim() === '') {
            setIsEmailValid(true);
            setError('');
            return;
        }
        const emailArray = emails.split(',').map(email => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emailArray.filter(email => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
            setError('Invalid email(s) format');
            setIsEmailValid(false);
        } else {
            setError('');
            setIsEmailValid(true);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmails(value);
        setModifySchedule(true);
    };

    const handleButtonClick = (button: string) => {
        setSelectedButton(button);
        setModifySchedule(true);
    };
    const handleYEARLYChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYEARLY(e.target.value);
        setModifySchedule(true);
    };
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(e.target.value);
        setModifySchedule(true);
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const numericValue = Math.max(0, Math.min(23, Number(value)));
        setHour(numericValue.toString().padStart(2, '0'));
        setModifySchedule(true);
    };
    
    const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const numericValue = Math.max(0, Math.min(59, Number(value)));
        setMinute(numericValue.toString().padStart(2, '0'));
        setModifySchedule(true);
    };
    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();    
        return `${day}-${month}-${year}`; 
    };

    useEffect(() => {
        async function fetchScheduleData(viewId: number, id: number) {
            const columndata = await view(viewId);
            if (columndata) {
                const description = columndata.description;
                const columnName = columndata.columnName;
                const dataType = columndata.dataType;
                setHeader([{ description, columnName, dataType }]);
            }
            try {
                if (columndata && Array.isArray(columndata.columns)) {
                    columndata.columns.forEach((column: ViewData) => { });
                    const columnNames = columndata.columns.map(
                        (item: ViewData) => item.columnName
                    );
                }
                else {
                    console.error(
                        "Expected columns to be an array:",
                        columndata.columns
                    );
                }

                const columnHead = await Fillters(viewId, id);
                if (columnHead) {
                    setViewHead((prevData) => ({
                        ...prevData,
                        name: columnHead.name,
                        id: columnHead.id,
                        description: columnHead.description,
                    }
                    ));
                }
                const schedule = await Modify(viewId, id, sid);  
                    
                if (schedule) {
                    setSelectedSchedule(schedule);
                    setTitle(schedule.title);
                    setDescription(schedule.description);
                    setEmail(schedule.toEmailAddresses);
                    setEmailEmptyResultSet(schedule.emailEmptyResultSet);
                    setHour(schedule.hour);
                    setMinute(schedule.minute);
                    setSelectedButton(schedule.frequency);
                    setDayOfWeek(schedule.day);
                    setDayOfMonth(schedule.dom);
                    setStartDate(formatDate(schedule.startDate));
                    setEndDate(formatDate(schedule.endDate));
                    setIsFormVisible(true);
                }
            } catch (error) {
                setCheckscheduleList([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchScheduleData(viewId, id);
    }, [viewId, id, sid]);

    const handlesCancel = () => {
     
        if (modifySchedule) {
            setIsCancelPopupVisible(true);
        } else {
           
            window.location.href =`/queries/${viewId}/Filters/${id}/Schedule`;
        }
    };
 
    const handleDiscard = () => {
        setIsCancelPopupVisible(false);
        window.location.href = `/queries/${viewId}/Filters/${id}/Schedule`;
    };

    const handleCancelClose = () => {
        setIsCancelPopupVisible(false);
    };

    const handleDelete = () => {
        setIsDeletePopupVisible(true);
    }
    const handleDiscarddelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        const result = await ScheduleDelete(sid, viewId, id); 
        if (result === 200) {
            window.location.href = `/queries/${viewId}/Filters/${id}/Schedule`;
        } else {
            alert("Delete failed...");
        }
    }
    const handledeleteClose =()=>{
        setIsDeletePopupVisible(false);
    }

    const handlesaves = async () => {
        
        let frequency = selectedButton.toUpperCase().replace(" ", "");
        const updatedPayload: Payloads = {
            id: sid,
            viewId: viewId,
            filterId: id,
            frequency,
            description,
            endDate: endDate.toString(),
            hour: hour,
            minute: minute,
            startDate: startDate.toString(),
            title,
            emailEmptyResultSet,
            toEmailAddresses: email,
        };
        if (selectedButton === 'WEEKLY') {
            updatedPayload.day = dayOfWeek.toUpperCase();
        } else if (selectedButton === 'MONTHLY') {
            updatedPayload.dom = dayOfMonth.toUpperCase();
        } else if (selectedButton === 'PERIODIC') {
            updatedPayload.dom = dayOfMonth.toUpperCase();
            updatedPayload.day = month.toUpperCase();
        }

        try {
            const response2 = await Modified(id, viewId, sid, updatedPayload);            
            window.location.href = `/queries/${viewId}/Filters/${id}/Schedule`;
        } catch (error) {
            console.error("Failed to modify schedule", error);
        }
    };

    if (isLoading) {
        return <div><SpinnerTest /></div>;
    };
    const onlyFutureDate = new Date().toISOString().split('T')[0];
    return (
        <div>
            <div className="p-3" style={{ backgroundColor: theadcolor }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {header.map((item, index) => (
                        <h1 key={index} className={`text-gray-600 font-bold ${isDarkMode ? 'text-white' : ''}`}>
                            {toPascalCaseWithSpaces(item.description)}/
                        </h1>
                    ))}
                    {viewhead?.name && (
                        <h1 className={`text-gray-600 font-bold ${isDarkMode ? 'text-white' : ''}`}>
                            {toPascalCaseWithSpaces(viewhead.name)}
                        </h1>
                    )}
                </div>
            </div>
            <div className="p-10">
                {isFormVisible ? (
                    <form className="space-y-3">
                        <div>
                            <label className={`block font-bold mb-2 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>*Title:</label>
                            <input
                                type="text"
                                className="h-8 w-80 border rounded-lg p-2"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setModifySchedule(true); 
                                }}
                            />
                        </div>
                        <div>
                            <label className={`block font-bold mb-2 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>*Description:</label>
                            <input
                                type="text"
                                className="h-8 w-80 border rounded-lg p-2"
                                value={description}
                                onChange={(e) =>{ setDescription(e.target.value)
                                    setModifySchedule(true);   
                                }}
                            />
                        </div>

                        <div>
                            <label className={`block font-bold mb-2 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>*Email to:</label>
                            <input
                                type="email"
                                className={`h-8 w-80 border rounded-lg p-2 ${error ? 'border-red-500' : ''}`}
                                placeholder="separate with commas"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {error && <span className="text-red-500 text-sm ml-2">
                                {error}
                            </span>}
                        </div>
                        <div className="flex items-center space-x-2 ">
                            <label htmlFor="empty-query" className={`font-bold text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
                                Email if the query result set is empty?
                            </label>
                            <input
                                type="checkbox"
                                id="empty-query"
                                className="h-4 w-4"
                                checked={emailEmptyResultSet}
                                onChange={(e) => setEmailEmptyResultSet(e.target.checked)}
                            />
                        </div>
                        <div className="mt-10 ">
                            <h2 className={`font-bold mb-2 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>When do you want to schedule this?</h2>
                            <div className="flex space-x-3 mb-5">
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'ONETIME' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('ONETIME')}
                                >
                                    One Time
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'DAILY' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('DAILY')}
                                >
                                    Daily
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'WEEKLY' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('WEEKLY')}
                                >
                                    Weekly
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'MONTHLY' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('MONTHLY')}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium  text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'PERIODIC' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('PERIODIC')}>
                                    Periodic
                                </button>
                            </div>

                            <div className="flex space-x-3">
                                <div>
                                    <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Start Date:</label>
                                    <div className="relative">
                                        <input
                                            type={inputType}

                                            className="h-8 w-52 border rounded-lg p-2"
                                            value={startDate}
                                            min={onlyFutureDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            onFocus={() => setInputType('date')}
                                            onBlur={() => {
                                                if (!startDate) setInputType('text');
                                            }}
                                        />
                                    </div>
                                </div>
                                {(selectedButton === 'DAILY' || selectedButton === 'WEEKLY' || selectedButton === 'MONTHLY' || selectedButton === 'PERIODIC') && (
                                    <div>
                                        <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>End Date:</label>
                                  <div className="relative">
                                        <input
                                             type={inputType}
                                            className="h-8 w-52 border rounded-lg p-2"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            min={onlyFutureDate}
                                            onBlur={() => {
                                                if (!endDate) setInputType('text');
                                            }}
                                        />
                                    </div>
                                    </div>
                                )}

                                {selectedButton === 'PERIODIC' && (
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Periodic:</label>
                                            <select className={`h-8 w-32 border rounded-lg p-1 ${!PERIODIC ? 'text-gray-400' : 'text-gray-900'}`}
                                                value={PERIODIC}
                                                onChange={handleYEARLYChange}
                                            >
                                                <option value="">Select period</option>
                                                <option value="Quarterly">Quarterly</option>
                                                <option value="Half_yearly">Half Yearly</option>
                                                <option value="Yearly">Yearly</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Month:</label>
                                            <select
                                                className={`h-8 w-32 border rounded-lg p-1 ${!month ? 'text-gray-400' : 'text-gray-900'}`}
                                                value={month}
                                                onChange={handleMonthChange}
                                            >
                                                <option value="">Select Month</option>
                                                <option value="01">January</option>
                                                <option value="02">February</option>
                                                <option value="03">March</option>
                                                <option value="04">April</option>
                                                <option value="05">May</option>
                                                <option value="06">June</option>
                                                <option value="07">July</option>
                                                <option value="08">August</option>
                                                <option value="09">September</option>
                                                <option value="10">October</option>
                                                <option value="11">November</option>
                                                <option value="12">December</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {selectedButton === 'WEEKLY' && (
                                    <div>
                                        <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Day of Week:</label>
                                        <select
                                            className={`h-8 w-32 border rounded-lg p-1 ${!dayOfWeek ? 'text-gray-400' : 'text-gray-900'}`}
                                            value={dayOfWeek}
                                            onChange={(e) => setDayOfWeek(e.target.value)}
                                        >
                                           <option value="">Select Day</option>
                                            <option value="SUNDAY">Sunday</option>
                                            <option value="MONDAY">Monday</option>
                                            <option value="TUESDAY">Tuesday</option>
                                            <option value="WEDNESDAY">Wednesday</option>
                                            <option value="THURSDAY">Thursday</option>
                                            <option value="FRIDAY">Friday</option>
                                            <option value="SATURDAY">Saturday</option>
                                        </select>
                                    </div>
                                )}
                                {(selectedButton === 'MONTHLY' || selectedButton === 'PERIODIC') && (
                                    <div>
                                        <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Date:</label>
                                        <select
                                            className={`h-8 w-20 border rounded-lg p-1 ${!dayOfMonth ? 'text-gray-400' : 'text-gray-900'}`}
                                            value={dayOfMonth}
                                            onChange={(e) => setDayOfMonth(e.target.value)}
                                        >
                                            <option value="">Date</option>
                                            {[...Array(31)].map((_, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="mb-5">
                                    <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Time:</label>
                                    <div className="flex items-center border rounded-lg overflow-hidden">
                                        <select
                                        value={hour}
                                        onChange={handleHourChange}
                                        className="h-8 w-16 border-r p-1 text-center border-none"
                                        >
                                            <option value="">HH</option>
                                            {hours.map((hr) => (
                                                 <option key={hr} value={hr}>
                                                    {hr}
                                                    </option>
                                                    ))}
                                                    </select>
                                        <span className="h-6 w-6 te flex items-center justify-center font-bold bg-white">:</span> 
                                        <select
                                            value={minute}
                                                onChange={handleMinuteChange}
                                                    className="h-8 w-16 border-r p-1 text-center border-none"
                                                    >
                                                    <option value=""> MM </option>
                                                        {minutes.map((min) => (
                                                            <option key={min} value={min}>
                                                                {min}
                                                    </option>
                                                ))}
                                        </select>                                                          
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex space-x-8 pr-10 mt-0 ">
                            <button
                                type="button"
                                className="text-[#848482] p-1 text-xl rounded flex items-center"
                                onClick={handlesCancel}>
                                <Tooltip tooltipText="Cancel">
                                <CancelIcon className=" w-6 h-6" />
                                </Tooltip>
                            </button>
                                <button
                                    type="button"
                                className={`text-[#b9cbba] p-1 text-xl rounded flex items-center  'opacity-50 cursor-not-allowed' : ''
                    }`}
                                    onClick={handlesaves} >
                                    <Tooltip tooltipText="Save">
                                    <SaveIcon className=" w-6 h-6" />
                                    </Tooltip>
                                </button>
                                <button
                                    type="button"
                                    className={`text-[#cd9898] p-1 text-xl rounded flex items-center  'opacity-50 cursor-not-allowed' : ''
                    }`}
                                    onClick={handleDelete}  >
                                    <Tooltip tooltipText="Delete">
                                    <DeleteIcon className=" w-6 h-6" />
                                    </Tooltip>
                                </button>
                           
                            
                            </div>
                            {isCancelPopupVisible && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="relative bg-white p-8 rounded shadow-md" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
                                        <h2 className={`text-xl font-medium mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
                                            Discard changes?
                                        </h2>
                                        <p className={`mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}  style={{ wordWrap: 'break-word' }}>
                                            You have unsaved changes that will be lost if you cancel. Are you sure?
                                        </p>
                                        <div className="absolute bottom-4 right-4 flex space-x-4">
                                            <button
                                                onClick={handleCancelClose}
                                                className={`px-4 py-2 rounded ${isDarkMode ? ' text-white border ' : 'text-gray-600'}`}
                                                
                                            >
                                               <Tooltip tooltipText="No">
                                            <CancelIcon />
                                              </Tooltip>
                                            </button>
                                            <button
                                                onClick={handleDiscard}
                                                className={`px-4 py-2 rounded ${isDarkMode ? ' text-white border ' : 'text-gray-600'}`}
                                                
                                            >
                                                <Tooltip tooltipText="Discard">
                                               <FontAwesomeIcon icon={faCheck} className={`w-5 h-5 text-[#99b99b] ${isDarkMode ? 'text-white' : ''}`} />
                                               </Tooltip>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isDeletePopupVisible && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="relative bg-white p-8 rounded shadow-md" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
                                        <h2 className={`text-xl font-medium mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
                                          Delete schedule?
                                        </h2>
                                        <p className={`mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}  style={{ wordWrap: 'break-word' }}>
                                        Are you sure you want to delete this schedule?
                                        </p>
                                        <div className="absolute bottom-4 right-4 flex space-x-4">
                                            <button
                                                onClick={handledeleteClose}
                                                className={`px-4 py-2 rounded ${isDarkMode ? ' text-white border ' : 'text-gray-600'}`}
                                               
                                            >
                                               <Tooltip tooltipText="No">
                                            <CancelIcon />
                                              </Tooltip>
                                            </button>
                                            <button
                                                onClick={handleDiscarddelete}
                                                className={`px-4 py-2 rounded ${isDarkMode ? ' text-white border ' : 'text-gray-600'}`}
                                                
                                            >
                                               <Tooltip tooltipText="Delete">
                                               <DeleteIcon className={`w-5 h-5 text-[#99b99b] ${isDarkMode ? 'text-white' : ''}`} />
                                               </Tooltip>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                ) : (
                    <div>
                    </div>
                )}
            </div>
        </div>
    );
}
