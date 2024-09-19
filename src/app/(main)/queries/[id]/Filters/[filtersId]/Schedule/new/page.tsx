"use client";
import { CheckScheduless, Fillters, Modify, view } from "@/api/route";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SpinnerTest from "@/app/components/spinnerTest";
import { useTheme } from "@/app/components/ThemeContext";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import { faCancel, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@/app/components/Tooltip";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { CancelIcon, SaveIcon } from "@/app/components/svgicons";

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
    const viewId = parseInt(pathParts[2]);
    const id = parseInt(pathParts[4]);
    const [checkscheduleList, setCheckscheduleList] = useState<CheckschedulesItem[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<CheckschedulesItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedButton, setSelectedButton] = useState('One Time');
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [emailEmptyResultSet, setEmailEmptyResultSet] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('');
    const { theadcolor,tbodycolor,color, isDarkMode } = useTheme();
    const [header, setHeader] = useState<ViewData[]>([]);
    const [viewhead, setViewHead] = useState<FilterData | null>(null);
    const [periodic, setPeriodic] = useState('');
    const [month, setMonth] = useState('');
    const [time, setTime] = useState({ hour: '', minute: '' });
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [successPopupVisible, setSuccessPopupVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); 

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
    };

    const handleButtonClick = (button: string) => {
        setSelectedButton(button);
    };
    const handlePeriodicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPeriodic(e.target.value);
    };
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(e.target.value);
    };

    const handleHourChange = (hour:string) => {
       
        const numericValue = Math.max(0, Math.min(23, Number(hour)));
        setTime(prevTime => ({ ...prevTime, hour: numericValue.toString().padStart(2, '0') }));
    };

    const handleMinuteChange = (minute:string) => {
        
        const numericValue = Math.max(0, Math.min(59, Number(minute)));
        setTime(prevTime => ({ ...prevTime, minute: numericValue.toString().padStart(2, '0') }));
    };

    useEffect(() => {
        if (title.trim() && description.trim() && email.trim() && startDate.trim() && time.hour.trim() &&
            time.minute.trim() && isEmailValid) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    }, [title, description, email, startDate, time, isEmailValid]);

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
            } catch (error) {
                setCheckscheduleList([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchScheduleData(viewId, id);
    }, [viewId, id]);

    const handlePost = async () => {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(parseInt(time.hour));
        startDateTime.setMinutes(parseInt(time.minute));
        const endDateTime = new Date(endDate);

        let frequency = selectedButton.toUpperCase().replace(" ", "");
        if (selectedButton === 'Periodic') {
            frequency = periodic.toUpperCase();
        }
        const payload: Payload = {
            id: null,
            frequency,
            emailEmptyResultSet,
            title,
            description,
            toEmailAddresses: email,
            startDate: startDateTime.toISOString(),
            endDate: selectedButton === 'One Time' ? "" : endDateTime.toISOString(),
            hour: time.hour,
            minute: time.minute,
        };

        if (selectedButton === 'Weekly') {
            payload.day = dayOfWeek.toUpperCase();
        } else if (selectedButton === 'Monthly') {
            payload.dom = dayOfMonth.toUpperCase();
        } else if (selectedButton === 'Periodic') {
            payload.dom = dayOfMonth.toUpperCase();
            payload.day = month.toUpperCase();
        }
        const response1 = await CheckScheduless(id, viewId, payload);
        if (response1 && response1.items) {
            const newSchedule = response1.items.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                email: item.email,
                contactId: item.contactId,
                frequency: item.frequency,
                active: item.active,
            }));
            setCheckscheduleList([...checkscheduleList, ...newSchedule]);
        }
            setSuccessMessage(`Schedule ${toPascalCaseWithSpaces(title)} has been saved successfully!`);
            setSuccessPopupVisible(true);
    };

    const closeSuccessPopup = () => {
        setSuccessPopupVisible(false); 
        window.location.href = `/queries/${viewId}/Filters/${id}/Schedule`;
    };

    if (isLoading) {
        return <div><SpinnerTest /></div>;
    }
    const handlesCancel = () => {
        if (title.trim() !== "" || description.trim() !== "" || email.trim() !== "" || startDate.trim() !== "" || time.hour.trim() !== "" ||
            time.minute.trim() !== "") {
            setIsCancelPopupVisible(true);
        } else {
            window.location.href = `/queries/${viewId}/Filters/${id}/Schedule`;
        }
    };

    const handleDiscard = () => {
        setIsCancelPopupVisible(false);
        window.location.href = `/queries/${viewId}/Filters/${id}/Schedule`;
    };
    const handleCancelClose = () => {
        setIsCancelPopupVisible(false);
    };

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
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={`block font-bold mb-2 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>*Description:</label>
                            <input
                                type="text"
                                className="h-8 w-80 border rounded-lg p-2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                            <label htmlFor="empty-query" className={`font-bold font-roboto text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
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
                                    className={`h-8 w-24 border rounded-lg font-medium font-roboto text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'One Time' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('One Time')}
                                >
                                    One Time
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'Daily' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('Daily')}
                                >
                                    Daily
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'Weekly' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('Weekly')}
                                >
                                    Weekly
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'Monthly' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('Monthly')}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    className={`h-8 w-24 border rounded-lg font-medium  text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: selectedButton === 'Periodic' ? color : theadcolor,
                                      }}
                                    onClick={() => handleButtonClick('Periodic')}>
                                    Periodic
                                </button>
                            </div>
                            <div className="flex space-x-3">
                                <div>
                                    <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Start Date:</label>
                                    <input
                                        type="date"
                                        className="h-8 w-52 border rounded-lg p-2"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                                {(selectedButton === 'Daily' || selectedButton === 'Weekly' || selectedButton === 'Monthly' || selectedButton === 'Periodic') && (
                                    <div>
                                        <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>End Date:</label>
                                        <input
                                            type="date"
                                            className="h-8 w-52 border rounded-lg p-2"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                )}
                                {selectedButton === 'Periodic' && (
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Periodic:</label>
                                            <select className={`h-8 w-32 border rounded-lg p-1 ${!periodic ? 'text-gray-400' : 'text-gray-900'}`}
                                                value={periodic}
                                                onChange={handlePeriodicChange}
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
                                {selectedButton === 'Weekly' && (
                                    <div>
                                        <label className={`block font-bold mb-2 text-gray-600 ml-1 ${isDarkMode ? 'text-white' : ''}`}>Day of Week:</label>
                                        <select
                                            className={`h-8 w-32 border rounded-lg p-1 ${!dayOfWeek ? 'text-gray-400' : 'text-gray-900'}`}
                                            value={dayOfWeek}
                                            onChange={(e) => setDayOfWeek(e.target.value)}
                                        >
                                            <option value="">Select Day</option>
                                            <option value="Sunday">Sunday</option>
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                        </select>
                                    </div>
                                )}
                                {(selectedButton === 'Monthly' || selectedButton === 'Periodic') && (
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
                                    <form className="max-w-[8rem] mx-auto ">    
                               <div className="relative">
                             <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none  ">
                                 <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                 </svg>
                             </div> 
                                   <input  type="time"  id="time" className="bg-gray-50  leading-none border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 
                                       dark:placeholder-gray-400 dark:text-black"   
                                       min="09:00"
                                       max="18:00"
                                       defaultValue="00:00"
                                       required 
                                       value={`${time.hour}:${time.minute}`}
                                       onChange={(e) => {
                                       const timeValue = e.target.value;
                                       const [hour, minute] = timeValue.split(':');
                                       handleHourChange(hour); 
                                       handleMinuteChange(minute);
                                       }}
                                       />
                               </div>
                               </form>
                              </div>
                            </div>
                        </div>
                        <div>
                        <div className="flex justify-end space-x-8 pr-10">
                        <button
                                type="button"
                                className={`text-[#848482] p-1 text-xl rounded flex items-center ${isDarkMode ? 'text-white' : ''}`}
                                onClick={handlesCancel}
                            >
                                <Tooltip tooltipText="Cancel" >
                                    <CancelIcon className="w-6 h-6" />
                                </Tooltip>
                            </button>
                            {!selectedSchedule && (<button
                                type="button"
                                className={`text-[#b9cbba] p-1 text-xl rounded flex items-center${isDarkMode ? 'text-white' : ''} ${!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                onClick={handlePost}
                                disabled={!isFormComplete}
                            >
                                <Tooltip tooltipText="Save" >
                                    <SaveIcon className="w-6 h-6" />
                                </Tooltip>
                            </button>)}
                            </div>
                    
                            {isCancelPopupVisible && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="relative p-8 rounded shadow-md "style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
                                        <h2 className={`text-xl font-medium mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
                                            Discard changes?
                                        </h2>
                                        <p className={`mb-4 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}  style={{ wordWrap: 'break-word' }}>
                                            You have unsaved changes that will be lost if you cancel. Are you sure?
                                        </p>
                                        <div className="absolute bottom-4 right-4 flex space-x-4">
                                            <button
                                                onClick={handleCancelClose}
                                                className={`px-4 py-2 rounded ${isDarkMode ? 'bg-black-200 text-white  ' : ''}`}

                                            >
                                                <Tooltip tooltipText="No">
                                                    <CancelIcon className="w-4 h-4"/>
                                                </Tooltip>
                                            </button>
                                            <button
                                                onClick={handleDiscard}
                                                className={`px-4 py-2 rounded ${isDarkMode ? 'bg-black-200  text-white  ' : ''}`}
                                            >
                                                <Tooltip tooltipText="Discard">
                                                    <FontAwesomeIcon icon={faCheck} 
                                                    className={`w-5 h-5 text-[#99b99b] ${isDarkMode ? 'text-white' : ''}`} />
                                                </Tooltip>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

              {successPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative p-8 rounded shadow-md" style={{ backgroundColor: theadcolor, width: "34.375rem", maxWidth: "100%", boxSizing: 'border-box', minHeight: "12.5rem", maxHeight: "100%" }}>
                        <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}>
                            Success Message
                        </h2>
                        <h3 className={`text-l mb-4 ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>
                            {successMessage}
                        </h3>
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
