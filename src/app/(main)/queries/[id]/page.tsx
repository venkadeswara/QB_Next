"use client";
import { Filters, jobss, Runconfigss, view, FillterDelete, CheckSchedules,Preferencess,peakHour } from "@/api/route";
import GenericButton from "@/app/components/Button";
import GenericTable from "@/app/components/Table";
import React, { useCallback, useEffect, useState } from "react";
import schedulesService from "@/api/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBan,
  faCheck,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import SpinnerTest from "@/app/components/spinnerTest";
import { jobs, Runconfig } from "@/api/route";
import { useTheme } from "@/app/components/ThemeContext";
import { DeleteIcon, PlayIcon, ScheduleIcon, PlusIcon, CancelIcon, EmailIcon, ModifyIcon, CreateIcon, OkIcon } from "@/app/components/svgicons";
import Tooltip from "@/app/components/Tooltip";
import { PrivateIcon, PublicIcon, FavouriteIcon, MyFilterIcon } from "@/app/components/svgicons";
import { format } from 'date-fns';
import { usePathname } from "next/navigation";

interface ViewItem {
  id: number;
  description: string;
  viewId: number;
  filterOwnerName: string;
  schedule: JSX.Element;
  run: JSX.Element;
  cancel: JSX.Element;
  privateFilter: boolean;
  favorite: boolean;
  name: string;
  myFilter: boolean;
}

interface displayName {
  description: string;
  id: number;
}

interface CheckschedulesItem {
  id:number;
  title: string;
  description: string;
  email: string;
  contactId: number;
  frequency: string;
  active: boolean;  
}
type FilterKeys = "privateFilter" | "public" | "favorite" | "myFilter";

export default function Filtersdata() {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const id = parseInt(pathParts[2]);
  const [viewsList, setViewsList] = useState<ViewItem[]>([]);
  const [myFilterData, setMyFilterData] = useState<ViewItem[]>([]);
  const [header, setHeader] = useState<displayName[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theadcolor, tbodycolor, isDarkMode, color } = useTheme();
  const [filters, setFilters] = useState({
    privateFilter: true,
    public: false,
    favorite: false,
    myFilter: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedViewId, setSelectedViewId] = useState<number | null>(null);
  const [isperfer, setIsperfer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ViewItem | null>(null);
  const [isWaitPopupVisible, setIsWaitPopupVisible] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState<string>("");
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupHeader, setPopupHeader] = useState<string>("");
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ViewItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenss, setIsModalOpenss] = useState(false);
  const [isIndiClick, setIsIndiClick] = useState(false);
  const [peakenable ,setpeakenable] = useState(Boolean)
  const [selectedItems, setSelectedItems] = useState<ViewItem | null>(null);
  const [payload, setPayload] = useState({});
  const [activeRuns, setActiveRuns] = useState<{ [key: number]: boolean }>({});
  const [errorPopups, setErrorPopups] = useState<Array<{ id: number; name: string; header: string; message: string }>>([]);
  const [emailPopups, setEmailPopups] = useState<Array<{id : number }>>([]);
  const [downloadPopups, setDownloadPopups] = useState<Array<{ id: number; link: string; name: string }>>([]);
  const [cancelPopups, setCancelPopups] = useState<Array<{ id: number, name: string }>>([]);
  const [abortControllers, setAbortControllers] = useState<{ [key: number]: AbortController }>({});
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const handleDeleteClick = (item: ViewItem) => {
    setItemToDelete(item);
    setPopupMessage(`Are you sure you want to delete the filter ${toPascalCaseWithSpaces(item.name)}?`);
    setIsDeletePopupVisible(true);
  };

  const handleConfirmDelete = async (item: any) => {
    try{
    const result = await FillterDelete(item.id, item.viewId);
    if (result === 200) {
      if (filters.myFilter) {
        setMyFilterData(prevData => prevData.filter(data => data.id !== item.id));
      } else {
        setViewsList(prevData => prevData.filter(data => data.id !== item.id));
      }
      setIsModalOpen(true)
    } else if (result === 403) {
      setIsModalOpenss(true)    
    } else {
      alert(`Failed to delete the filter: Unexpected error occurred. `);}
    } catch (error) {
      console.error("Error during delete operation:", error);
    } finally {
      setIsDeletePopupVisible(false);
      setItemToDelete(null);
    }
  };
  const handleClosePopup = () => {
    setIsModalOpen(false);
    setIsModalOpenss(false);
  };
  const handleCancelDelete = () => {
    setIsDeletePopupVisible(false);
    setItemToDelete(null);
  };
  const handleCancelClick = (item: ViewItem) => {
    setCancelPopups(prev => [...prev, { id: item.id, name: item.name }]);
    setPopupMessage(`Do you want to cancel the running filter ${toPascalCaseWithSpaces(item.name)}?`);
  };

  const updatePrivateFilter = (viewId: number, filterId: number, newPrivateFilterValue: any) => {
   
  
    setViewsList(prevViewsList =>
      prevViewsList.map(viewItem => {
        if (viewItem.viewId === viewId && viewItem.id === filterId) {
          let newFavorite = viewItem.favorite;
  
          if (newPrivateFilterValue === true) {
            newFavorite = !viewItem.favorite;
          }
  
          return {
            ...viewItem,
            privateFilter: newPrivateFilterValue === "Y" ? true : newPrivateFilterValue === "N" ? false : viewItem.privateFilter,
            favorite: newFavorite,
          };
        }
        return viewItem;
      })
    );
  };
  
  
  const handlePeferenseClose =() =>
    {
      setIsperfer(false);
    }

  const handlePerfercenseok = async () => {
    if (selectedItems && payload) {
      try {
          const result = await Preferencess(selectedItems.viewId, selectedItems.id, payload);
          
          if (result === 403) {
              setErrorPopups(prev => [
                ...prev,
                {
                  id: selectedItems.id,
                  name: "", 
                  header: `Access Denied !`,
                  message: `The Query Filter cannot be set as private, as it is owned by another user. Only the user who created a Query Filter can modify it. (You can set it as your favorite)`
                }
              ]);
          } else {
              const newPrivateFilterValue = result.PrivateFilter ? result.PrivateFilter[1] : true;
              updatePrivateFilter(selectedItems.viewId, selectedItems.id, newPrivateFilterValue);
          }
      } catch (error) {
          console.error("Error calling Preferences API:", error);
      } finally {
          setIsperfer(false);
      }
  }
};


const handlePerfercense = (item: ViewItem, toggleType: 'privateFilter' | 'favorite') => {
  let filterType, updatedFilterType, message;
  if (toggleType === 'favorite') {
    filterType = item.favorite ? "Favorite" : "Non-Favorite";
    updatedFilterType = !item.favorite ? "Favorite" : "Non-Favorite";
    message = `Do you want to ${item.favorite ? 'remove' : 'add'} the filter ${toPascalCaseWithSpaces(item.name)} ${item.favorite ? 'from your' : 'to your'} favorite list?`;
  } else {
    filterType = item.favorite
      ? item.privateFilter
          ? "Private Favorite"
          : "Public Favorite"
      : item.privateFilter
          ? "Private"
          : "Public";

    updatedFilterType = item.favorite
      ? item.privateFilter
          ? "Public Favorite"
          : "Private Favorite"
      : item.privateFilter
          ? "Public"
          : "Private";
    message = `Do you want to modify the filter ${toPascalCaseWithSpaces(item.name)} from ${filterType} to ${updatedFilterType}?`;
  }

  setPopupMessage(message);
  setIsperfer(true);

  const newPayload = {
    id: item.id,
    viewId: item.viewId,
    name: item.name,
    description: item.description,
    filterOwnerName: item.filterOwnerName,
    convertedFromLegacyId: null,
    addContactId: 1,
    favorite: toggleType === 'favorite' ? !item.favorite : item.favorite,
    privateFilter: toggleType === 'privateFilter' ? !item.privateFilter : item.privateFilter,
  };
  setSelectedItems(item);
  setPayload(newPayload);
};

const handleConfirmCancel = (id: number) => {
  if (abortControllers[id]) {
    abortControllers[id].abort();
  }
  setCancelPopups((prev) => prev.filter(popup => popup.id !== id));
  setAbortControllers((prev) => {
    const { [id]: _, ...rest } = prev;
    return rest;
  });
  setActiveRuns(prev => ({ ...prev, [id]: false }));
  };

  const handleCancelClose = (id: number) => {
    setCancelPopups((prev) => prev.filter((popup) => popup.id !== id));
  };
  const schedulebutton = async (id: number, viewId: number) => {
    setSelectedId(id);
    setSelectedViewId(viewId);
    try {
      const response = await CheckSchedules(id, viewId);
      if (response && Array.isArray(response.items)) {
        const mappedCheckSchedules: CheckschedulesItem[] = response.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          email: item.email,
          contactId: item.contactId,
          frequency: item.frequency,
          active: item.active,
        }));
 
        if (mappedCheckSchedules.length > 0) {
          setIsOpen(true);
        } else {
         
          window.location.href = `/queries/${id}/Filters/${viewId}/Schedule/new`;
        }
      } else {      
       
      }
    } catch (error) {
 
      console.error("Error fetching schedules:", error);
    } finally {
     
    }
  };
  const handleCreate = (id: number | null, viewId: number | null) => {
    window.location.href = `/queries/${id}/Filters/${viewId}/Schedule/new`;
  };
  const handleModify = (id: number | null, viewId: number | null) => {
    window.location.href = `/queries/${id}/Filters/${viewId}/Schedule`;
  };
   const handleCancel =()=>{
    setIsOpen(false)
  }
 
  useEffect(() => {
    async function fetchViews(id: number) {      
      try {
        const dynamicheader = await view(id);
        if (dynamicheader) {
          const description = dynamicheader.description;
          const id = dynamicheader.id;
          setHeader([{ description, id }]);
        }
        const response = await Filters(id);
        if (response && Array.isArray(response.items)) {
          const mappedViews: ViewItem[] = response.items.map((item: any) => ({
            id: item.id,
            viewId: item.viewId,
            name: item.name,
            description: item.description,
            filterOwnerName: item.filterOwnerName,
            privateFilter: item.privateFilter,
            favorite: item.favorite,
            myFilter: item.myFilter
          }));
          setViewsList(mappedViews);
        } else {
          setViewsList([]);
        }
      } catch (error) {
        setViewsList([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchViews(id);
  }, [id]);

  useEffect(() => {
    const fetchPeakHour = async () => {
      try {
        const peakhour = await peakHour();
        setpeakenable(peakhour === true);
      } catch (error) {
        console.error('Error fetching peak hour data:', error);
      }
    };
 
    fetchPeakHour();
    const intervalId = setInterval(fetchPeakHour, 5000);
    return () => clearInterval(intervalId);
  }, [peakenable]);

  const renderPreferences = (item: ViewItem) => (   
    <div className="flex items-center justify-between space-x-2">
      <label className="ml-3 inline-flex items-center">
        <button
          onClick={() => {
            if (!item.privateFilter) {
              handlePerfercense(item, 'privateFilter');
            }
          }}
          className="flex items-center focus:outline-none"
          aria-label="Toggle Private Filter"
        >
          <Tooltip tooltipText="Private">
            <PrivateIcon isActive={item.privateFilter} className="h-1" />
          </Tooltip>
        </button>
      </label>
      <label className="inline-flex items-center">
        <button
          onClick={() => {
            if (item.privateFilter) {
              handlePerfercense(item, 'privateFilter');
            }
          }}
          className="flex items-center focus:outline-none"
          aria-label="Toggle Public Filter"
        >
          <Tooltip tooltipText="Public" position="top" marginClass="mt-2">
            <PublicIcon isActive={!item.privateFilter} />
          </Tooltip>
        </button>
      </label>
      <label className="inline-flex items-center">
        <button
          onClick={() => {
            if (!item.favorite) {
              setPopupMessage(`Do you want to add the filter ${toPascalCaseWithSpaces(item.name)} to favorite?`);
              setIsperfer(true);
              handlePerfercense(item, 'favorite');
            } else {
              setPopupMessage(`Do you want to remove the filter ${toPascalCaseWithSpaces(item.name)} from favorite?`);
              setIsperfer(true);
              handlePerfercense(item, 'favorite');
            }
          }}
          className="mr-3 flex items-center focus:outline-none"
          aria-label="Toggle Favorite Filter"
        >
          <Tooltip tooltipText="Favorite">
            <FavouriteIcon isActive={item.favorite} />
          </Tooltip>
        </button>
      </label>
    </div> 
);
  
  const renderActions =(item: any) => {
    const isRunActive = !!activeRuns[item.id]; 
    const isCancelDisabled = !isRunActive || cancelPopups.some(popup => popup.id === item.id);
    return(
    <div className="flex items-center justify-between">
      <button
        onClick={() => handleDeleteClick(item)}
        className="mr-3 ml-2 py-0.5 text-[#cd9898]"
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <Tooltip tooltipText="Delete">
          <DeleteIcon />
        </Tooltip>
      </button>
      <button
        className="mr-3 py-0.5 text-[#626d78] flex items-center"
        onClick={() => schedulebutton(item.viewId, item.id)}
      >
        <Tooltip tooltipText="Schedule">
          <ScheduleIcon />
        </Tooltip>
      </button>
      <button
        onClick={() => handleRunClick(item)}
        className={`mr-2 py-0.5 text-[#587d90] flex items-center ${peakenable ? 'cursor-not-allowed opacity-50' : ''}`}
        style={{ backgroundColor: "transparent", border: "none" }}
        disabled={peakenable}
      >
        <Tooltip tooltipText={peakenable ? "Peakhour" : "Run"}>
          <PlayIcon isIndiClick={isRunActive} />
        </Tooltip>
      </button>
      <button
        onClick={() => handleCancelClick(item)}
        className={`mr-2 py-0.5 text-[#848482] text-xl flex items-center ${
          isCancelDisabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        style={{
          backgroundColor: "transparent",
          border: "none",
        }}
        disabled={isCancelDisabled}
      >
        <Tooltip tooltipText="Cancel">
        <CancelIcon className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-[#848482]'}`} />
        </Tooltip>
      </button>
    </div>
  );
};

useEffect(() => {
  if (viewsList.length > 0) {
    const updatedViews = viewsList.map((item) => ({
      ...item,
      preferences: renderPreferences(item),
      actions: renderActions(item),
    }));
    if (JSON.stringify(viewsList) !== JSON.stringify(updatedViews)) {
      setViewsList(updatedViews);
    }
  }
}, [viewsList, activeRuns, peakenable, renderActions, renderPreferences]);

  const toggleFilter = (filterKey: FilterKeys) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  const filteredViewsList = viewsList.filter(
    (view) =>
      (filters.privateFilter && view.privateFilter) ||
      (filters.public && !view.privateFilter) ||
      (filters.favorite && view.favorite) ||
      (filters.myFilter && view.myFilter)
  );

  const dataToDisplay = filteredViewsList.map(({ name, filterOwnerName, ...rest }) => ({
    "Filter Name": name,
    "Filter Owner": filterOwnerName,
    ...rest,
  }));

  const intervalIdRef = React.useRef<NodeJS.Timeout | null>(null);
  const startCheckingJob = (checkJob: () => Promise<void>) => {
    intervalIdRef.current = setInterval(() => {
      checkJob();
    }, 5000);
  };

  const stopCheckingJob = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };
  const handleRunClick = (item: ViewItem) => {
    setActiveRuns(prev => ({ ...prev, [item.id]: true }));
    setSelectedItem(item);
    setIsPopupVisible(true);
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(()=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmails = () => {
    const emailArray = emailAddresses
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

      if (emailArray.length === 0) {
        setEmailError('');  
        setIsEmailValid(false);  
        return;
      }

    const invalidEmails = emailArray.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setEmailError(`Invalid email address: ${invalidEmails.join(", ")}`);
      setIsEmailValid(false);
    } 
    else {
      setEmailError('');
      setIsEmailValid(true);
    }
  }; 
    validateEmails();
  }, [emailAddresses]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setEmailAddresses(event.target.value);
    } catch (error) {
    }
  };

  const handleEmailClick = (id:number) => {
    setIsPopupVisible(false);
    setEmailPopups(prev => {
      if (!prev.some(popup => popup.id === id)) {
        return [...prev, { id }];
      }
      return prev;
    });
  };

  function formatCustomTime(date: Date): string {
    const hours = format(date, 'HH');
    const minutes = format(date, 'mm');
    const seconds = format(date, 'ss');
    return `${hours} hours, ${minutes} minutes, and ${seconds}seconds`;
}
  const handleEmailSubmit = async (id: number) => {
    const emailArray: string[] = emailAddresses
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailArray.length === 0) {
      setEmailError("Please enter atleast one email address")
      setIsEmailValid(false);
    }
    else{
    const invalidEmails = emailArray.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setEmailError(`Invalid email address: ${invalidEmails.join(", ")}`);
      setIsEmailValid(false);
      return;
    }
    setEmailError('');
    const controller = new AbortController();
    const { signal } = controller; 
    setAbortControllers(prev => ({ ...prev, [selectedItem!.id]: controller }));

    try {
      setEmailPopups(prev => prev.filter(popup => popup.id !== id));
      setIsWaitPopupVisible(true);

      const configData = await Runconfigss(
        selectedItem!.viewId,
        selectedItem!.id,
        selectedItem!.name,
        emailAddresses,
        signal
      );
      const formattedName = toPascalCaseWithSpaces(selectedItem!.name);
      if(configData.id===null){
        const dates = new Date(configData.lastRunTime);
        const time = formatCustomTime(dates);
        dates.setHours(dates.getHours() + 1);
        const onehour = formatCustomTime(dates);
    
        setErrorPopups(prev => [
          ...prev,
          {
            id: id,
            name: formattedName, 
            header: `Email Job Errored For Filter - ${formattedName} !`,
            message: `You have already run this filter today at ${time}. Please run the filter on or after ${onehour}!`
          }
        ]);
      }
      else if (configData) {
        let count = 0;
        let successShown = false;
        const checkJob = async () => {
          try {
            const job = await jobss(selectedItem!.viewId, selectedItem!.id, configData.id,signal);
            if (job.status === 'COMPLETED' || job.status === 'QUEUED') {
              stopCheckingJob();
              if (!successShown) {
                successShown = true;
                setErrorPopups(prev => [
                  ...prev,
                  {
                    id: id,
                    name: formattedName, 
                    header: `Email Job Finished For Filter - ${formattedName} !`,
                    message: `Email is queued for processing for filter - ${formattedName}. You will receive email shortly.`
                  }
                ]);
              }
            } else if (job.status === 'ERROR') {
              stopCheckingJob();
              setErrorPopups(prev => [
                ...prev,
                {
                  id: id,
                  name: formattedName, 
                  header: `Email job errored for filter - ${formattedName} !`,
                  message: `Your email request for the Filter: ${formattedName} has errored. The error message was: \n${job.message || 'No additional error information available.'}`
                }
              ]);
            } else if (count < 1) {
              count++;
              setTimeout(checkJob, 5000);
            } else {
              stopCheckingJob();
            }
          } catch (error: unknown) {

            let errorMessage = "Your email request has failed for an unknown reason. Please contact a System Administrator.";
            setErrorPopups(prev => [
              ...prev,
              {
                id: id,
                name: formattedName, 
                header: `Email Job Failure For Filter - ${formattedName} !`,
                message: `Your email request has errored. The error message was: \n${errorMessage}`
              }
            ]);
          } finally {
            setIsWaitPopupVisible(false);
          }
        };
        checkJob();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
      }
    }
    finally {
      setEmailAddresses('');
    } }
  };

  const handleWaitClick = async (
    filterName: string,
    id: number,
    filterId: number,
  ) => {
    setIsPopupVisible(false);
    setIsWaitPopupVisible(true);
  
 
    const formattedName = toPascalCaseWithSpaces(selectedItem!.name);
    const retryInterval = 5000;
    const controller = new AbortController();
    const { signal } = controller;
    setAbortControllers(prev => ({ ...prev, [id]: controller }));
 
    try {
      const results = await schedulesService.Runconfig(
        id,
        filterId,
        filterName,
        emailAddresses,
        signal
      );
    
      if (results.id === null) {
        const dates = new Date(results.lastRunTime);
        const time = formatCustomTime(dates);
        dates.setHours(dates.getHours() + 1);
        const onehour = formatCustomTime(dates);
    
        setErrorPopups(prev => [
          ...prev,
          {
            id: id,
            name: formattedName, 
            header: `Query Job Errored For Filter - ${formattedName} !`,
            message: `You have already run this filter today at ${time}. Please run the filter on or after ${onehour}!`
          }
        ]);
      } else {
        let jobResults = await schedulesService.jobs(id, filterId, results.id, signal);
    
        while (jobResults.status === 'QUEUED') {
          await new Promise(resolve => setTimeout(resolve, retryInterval));
          jobResults = await schedulesService.jobs(id, filterId, results.id, signal);
        }
    
        if (jobResults.status === 'COMPLETED' && jobResults.downloadLink) {
          setDownloadLink(jobResults.downloadLink);
          setDownloadPopups(prev => [
            ...prev,
            {
              id: id,
              link: jobResults.downloadLink,
              name: formattedName
            }
          ]);
        } else if (jobResults.status === 'ERROR') {
          stopCheckingJob();
          setErrorPopups(prev => [
            ...prev,
            {
              id: id,
              name: formattedName, 
              header: `Query Job Errored For Filter - ${formattedName} !`,
              message: `Your Query for the Filter: ${formattedName} has errored. The error message was:\n${jobResults.message}`
            }
          ]);
        } else {
          stopCheckingJob();
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted'); 
      } else {
        let errorMessage = "Your query request has failed for an unknown reason. Please contact a System Administrator.";
        if (error instanceof Error) {
          console.error('Failed to execute API call:', error.message);
          errorMessage = `Your job request has errored. The error message was: \n${error.message}`;
        } else {
          console.log(error);
        }
        setErrorPopups(prev => [
          ...prev,
          {
            id: id,
            name: formattedName, 
            header: `Query Job Errored For Filter - ${formattedName} !`,
            message: errorMessage
          }
        ]);
      }
    } finally {
      setIsWaitPopupVisible(false);
      setAbortControllers(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  }    
 

  const handleWaitPopupClose = () => {
    setIsWaitPopupVisible(false);
  };

  const handleDownloadClick = (url: string) => {
    window.open(url, "_blank");
  };

  if (isLoading) {
    return <div><SpinnerTest /></div>;
  }

  let noDataMessage = '';
  const anyFilterSelected = filters.privateFilter || filters.public || filters.favorite || filters.myFilter;
  
  if (viewsList.length === 0) {
    noDataMessage = 'No filters are available for this view. Click New Filter to create one.';
  } else if (!anyFilterSelected) {
    noDataMessage = 'No preferences are currently selected. Please select a preference to view the filters.';
  } else if (filteredViewsList.length === 0) {
    if (filters.public) {
      noDataMessage = 'No public filters are available for this view.';
    } else if (filters.privateFilter) {
      noDataMessage = 'No private filters are available for this view.';
    } else if (filters.favorite) {
      noDataMessage = 'No favorite filters are available for this view.';
    } else if (filters.myFilter) {
      noDataMessage = "You haven't created any filters yet. Create one to get started.";
    }
  }

  return (
    <div className="fixed w-[93vw]">
      <div className=" p-3 " style={{ backgroundColor: theadcolor }}>
        {header.map((item, index) => (
          <div key={index}>
            <h1 className={`text-gray-600 font-bold ${isDarkMode ? 'text-white' : ''}`}>
              {toPascalCaseWithSpaces(item.description)}
            </h1>
          </div>
        ))}
      </div>
      <div className={`ml-6 -mt-5 flex justify-between items-center ${isDarkMode ? 'text-white' : ''}`}>
        <div className="flex items-center ">
          <label className="mr-4 mt-6 inline-flex items-center">
           
              <button
                onClick={() => toggleFilter("privateFilter")}
                className="flex items-center focus:outline-none"
                aria-label="Toggle Private Filter"
              >
                 <Tooltip tooltipText="Private">
                <PrivateIcon
                  isActive={filters.privateFilter} />
                   </Tooltip>
              </button>           
          </label>

          <label className="mr-3 mt-6 inline-flex items-center">
          
              <button
                onClick={() => toggleFilter("public")}
                className="flex items-center focus:outline-none"
                aria-label="Toggle Public Filter"
              >
                  <Tooltip tooltipText="public"  position="top" marginClass="mt-2">
                <PublicIcon
                  isActive={filters.public}
                />
                  </Tooltip>
              </button>
          
          </label>

          <label className="mr-3 mt-6 inline-flex items-center">
          
              <button
                onClick={() => toggleFilter("favorite")}
                className="flex items-center focus:outline-none"
                aria-label="Toggle Favorite Filter"
              >
                  <Tooltip tooltipText="Favorite">
                <FavouriteIcon
                  isActive={filters.favorite}
                />
                 </Tooltip>
              </button>
           
          </label>
          <label className="mr-3 mt-6 inline-flex items-center">
          
              <button
                onClick={() => toggleFilter("myFilter")}
                className="flex items-center focus:outline-none"
                aria-label="Toggle My Filter"
              >
                  <Tooltip tooltipText="My Filter">
                <MyFilterIcon
                  isActive={filters.myFilter}
                />
                 </Tooltip>
              </button>
           
          </label>
        </div>
        <div className="mr-4 mt-6 flex items-center">
          {header.map((item, index) => (
            <div key={index} className="mr-2">
                <Link href={`/queries/${item.id}/Filters/new`}>
                  <button className={`font-bold  bg-[#CECECE] text-gray-600 py-2 px-2 rounded w-28 h-8 flex items-center justify-center ${
        isDarkMode ? 'text-white' : 'text-gray-600'}`} style={{backgroundColor:theadcolor}}>
                    <div className="flex items-center font-bold">
                      <PlusIcon className="text-grey-400 w-4 h-4 " />
                      <span className="text-sm ml-2">New Filter</span>
                    </div>
                  </button>
                </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="-mt-5">
  {dataToDisplay.length > 0 ? (
    <GenericTable
      data={dataToDisplay.map(
        ({ privateFilter, favorite, myFilter, ...rest }) => rest
      )}
      isLoading={isLoading}
    />
  ) : (
    <p className={`flex items-center justify-center h-screen -mt-20 text-[#848482]  ${isDarkMode ? 'text-white' : ''}`}>
      {noDataMessage}
    </p>
  )}
</div>
      {isModalOpen && (
        <div className="flex items-center justify-center fixed inset-0  bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-8" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
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
      {isOpen && (
      <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 z-50">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
      <div
          className="relative bg-white max-w-xl transform overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all "
         style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>

          <h3 className={`text-lg font-medium leading-6 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
            Create or Modify?
          </h3>
          <div className="mt-4">
            <p className={`text-sm text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
              Schedules exist for this Filter. Do you want to Create New or Modify Existing?
            </p>
          </div>
 
          <div className="absolute bottom-4 right-4 flex space-x-1">
            <button
              type="button"
              className="inline-flex justify-center background-transparent px-4 py-2 "
              onClick={() => handleCreate(selectedId, selectedViewId)}
            >
              <Tooltip tooltipText="Create">
                <CreateIcon />
              </Tooltip>
            </button>
            <button
              type="button"
              className="inline-flex justify-center background-transparent px-4 py-2"
              onClick={() => handleModify(selectedId,selectedViewId)}
            >
              <Tooltip tooltipText="Modify">
                <ModifyIcon />
              </Tooltip>
            </button>
            <button
              type="button"
              className="inline-flex justify-center background-transparent px-4 py-2"
              onClick={handleCancel}
            >
              <Tooltip tooltipText="Cancel">
                <CancelIcon />
              </Tooltip>
            </button>
          </div>
        </div>
      </div>
    </div>
    )}
      {isModalOpenss && (
        <div className="flex items-center justify-center fixed inset-0   bg-black bg-opacity-50 z-50 ">
          <div className="relativebg-white rounded-lg p-8"style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Access Denied !</h2>
              <h3 className={`font-roboto text-lg font-lite leading-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                The Query Filter cannot be deleted, as it is owned by another user.
              </h3>
              <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
            onClick={handleClosePopup}
            className={`bg-transparent font-medium px-4 py-2 rounded absolute bottom-4 right-8 ${isDarkMode ? 'text-white' : ''}`} >
            <Tooltip tooltipText="Ok">
              <OkIcon  color="#89c78d"/>
            </Tooltip>
          </button>
          </div>


            </div>
          </div>
      )}
      {isPopupVisible && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" >
          <div className="relative bg-white rounded-lg p-8 "style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
            <div className="flex justify-end -mr-5 -mt-6 ">
              <button
                 onClick={() => {
                  setIsPopupVisible(false);
                  setActiveRuns(prev => ({ ...prev, [selectedItem.id]: false }));
                }}
                className={`text-gray-600 hover:text-gray-800 focus:outline-none ${isDarkMode ? 'text-white' : ''}`}
              >
                <Tooltip tooltipText="Cancel" position="bottom">
                <FontAwesomeIcon icon={faTimes} size="lg" />
                </Tooltip>
              </button>
            </div>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>Run or Email {toPascalCaseWithSpaces(selectedItem.name)}</h2>
            <p className={`font-roboto ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>
            You can choose to either wait for the results,or have them emailed to you.
            </p>
             <div className="absolute bottom-4 right-4 flex space-x-4">
              <GenericButton
                text={
                  <div className="flex items-center bg-transparent ">
                    <Tooltip tooltipText="Run">
                    <PlayIcon isIndiClick={isIndiClick} />
                    </Tooltip>
                  </div>
                }
                onClick={() =>
                  handleWaitClick(
                    selectedItem.name,
                    selectedItem.id,
                    selectedItem.viewId
                  )
                }
                color="mildgreen"
                className=" bg-transparent"
              />
              <GenericButton
                text={
                  <div className="flex items-center bg-transparent text-[#587d90]">
                    <Tooltip tooltipText="Email">
                      <EmailIcon />
                    </Tooltip>
                  </div>
                }
                onClick={() => handleEmailClick(selectedItem.id)}
                className="bg-transparent "
              />
            </div>
          </div>
        </div>
      )}

      {errorPopups.map(popup => (
        <div key={popup.id} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="relative bg-white p-8 rounded shadow-md w-full max-w-lg"
           style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
          
            <h2 className={`text-xl mb-4 font-bold ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>
              {popup.header}
            </h2>
            <p className={`text-l mb-4 ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>
              {popup.message}
            </p>
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={() => {
                  setErrorPopups(prev => prev.filter(p => p.id !== popup.id));
                  if (popup.id && activeRuns[popup.id]) {
                    setActiveRuns(prev => ({ ...prev, [popup.id]: false }));
                  }
                }}
                className={`bg-transparent font-medium px-4 py-2 rounded ${isDarkMode ? 'text-white' : ''}`}
              >
                <Tooltip tooltipText="Ok">
                  <OkIcon color="#c22d25" />
                </Tooltip>
              </button>
            </div>
          </div>
        </div>
      ))}

      {emailPopups.map(popup => (
        <div key={popup.id} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded shadow-md" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>
                Enter Email Addresses
              </h2>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter email addresses (comma separated)"
                className={`w-full border rounded p-2 mb-4 ${isDarkMode ? 'text-white' : ''}`}
                style={{ backgroundColor: theadcolor, borderColor: color }}
                value={emailAddresses}
                onChange={handleEmailChange}
              />
              {emailError && <p className="text-red-500" style={{ wordWrap: 'break-word' }}>{emailError}</p>}
               <div className="absolute bottom-4 right-4 flex space-x-4">

               <button
                  onClick={() => {
                    setEmailPopups(prev => prev.filter(p => p.id !== popup.id));
                    if (popup.id && activeRuns[popup.id]) {
                      setActiveRuns(prev => ({ ...prev, [popup.id]: false }));
                    }
                  }}
                  className="bg-transparent text-[#8a8a8a] font-medium px-4 py-2 rounded"
                >
                  <Tooltip tooltipText="Cancel">
                    <CancelIcon className={`${isDarkMode ? 'text-white' : ''}`} />
                  </Tooltip>
                </button>

                <button onClick={() => handleEmailSubmit(popup.id) } disabled={!isEmailValid} className="bg-transparent font-medium px-4 py-2 rounded">
                  <Tooltip tooltipText="Go">
                    <FontAwesomeIcon icon={faArrowRight} className={`text-[#99b99b] ${isDarkMode ? 'text-white' : ''} ${!isEmailValid ? 'opacity-50 cursor-not-allowed' : ''}`} />
                  </Tooltip>
                </button>
                
              </div>
            </div>
          </div>
        </div>
      ))}


      {downloadPopups.map(popup => (
        <div
          key={popup.id}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div
            className="relative bg-white p-6 rounded shadow-md"
            style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
          
            <h2
              className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}
              style={{ wordWrap: 'break-word' }}
            >
              Query Job Finished For Filter - {toPascalCaseWithSpaces(popup.name)}
            </h2>
            <a
              href={popup.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-500 hover:underline ${isDarkMode ? 'text-white' : ''}`}
            >
              Download query results
            </a>
            <div className="flex justify-end mt-4 bg-transparent">
              <Tooltip tooltipText="Download">
                <GenericButton
                  text={
                    <div className={`flex items-center ${isDarkMode ? 'text-white' : ''}`}>
                      <OkIcon color="#89c78d" />
                    </div>
                  }
                  onClick={() => {
                    setDownloadPopups(prev => prev.filter(p => p.id !== popup.id));
                    setActiveRuns(prev => ({ ...prev, [popup.id]: false }));
                  }}
                  color="mildgreen"
                  className="bg-transparent"
                />
              </Tooltip>
            </div>
          </div>
        </div>
      ))}


      {isDeletePopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-8" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
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
                onClick={() => handleConfirmDelete(itemToDelete)}
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
      {cancelPopups.map(popup => (
        <div key={popup.id} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded shadow-md" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Confirm Cancel</h2>
            <p className={`font-roboto ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>
              Do you want to cancel the running filter {toPascalCaseWithSpaces(popup.name)}?
            </p>
            <div className="absolute bottom-4 right-4 flex space-x-4">
            <button
                onClick={() => handleCancelClose(popup.id)}
                className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`}
              >
                <Tooltip tooltipText="Cancel">
                  <CancelIcon className="w-4 h-4" />
                </Tooltip>
              </button>
              <button
                onClick={() => handleConfirmCancel(popup.id)}
                className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`}
              >
                <Tooltip tooltipText="OK">
                  <OkIcon color="#89c78d" />
                </Tooltip>
              </button>
            </div>
          </div>
        </div>
      ))}
{isperfer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-md" style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Change preferences</h2>
            <p className={`font-roboto ${isDarkMode ? 'text-white' : ''}`} style={{ wordWrap: 'break-word' }}>{popupMessage}</p>
            <div className="absolute bottom-4 right-4 flex space-x-4">
            <button
                onClick={handlePeferenseClose}
                className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`} 
              >
                <Tooltip tooltipText="Cancel">
                  <CancelIcon className="w-4 h-4" />
                </Tooltip>
              </button>

              <button
                onClick={handlePerfercenseok}
                className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`}
              >
                <Tooltip tooltipText="OK">
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
