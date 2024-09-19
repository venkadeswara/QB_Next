import React, { useEffect, useRef,useState} from "react";
import Tooltip from "./Tooltip";
import { FilterIcon } from "./svgicons";
import { useTheme } from "../components/ThemeContext";

interface FilterProps {
  header: string;
  filterConfig: Record<string, string | undefined>;
  handleFilterChange: (key: string, value: string) => void;
  activeFilter: string | null;
  setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>;
}

const Filter: React.FC<FilterProps> = ({
  header,
  filterConfig,
  handleFilterChange,
  activeFilter,
  setActiveFilter,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode} = useTheme();
  const isActive = activeFilter === header || !!filterConfig[header];

  const handleIconClick = () => {
    if (isFilterOpen) {
      if (!filterConfig[header]) {
        setIsFilterOpen(false);
        setActiveFilter(null);
      } 
    } else {
      setIsFilterOpen(true);
      setActiveFilter(header);
    }
  };

  useEffect(()=>{
  const handleClickOutside = (event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node) &&
      !filterConfig[header]
    ) {  
        setIsFilterOpen(false);
        setActiveFilter(null);
    }
  };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterConfig, header, setActiveFilter]);

  useEffect(() => {
    if (isFilterOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFilterOpen]);

  return (
    <div ref={filterRef} className={`flex items-center ${isDarkMode ? 'text-black' : ''}`} >
       <Tooltip tooltipText="Filter">
      <FilterIcon
        className ="ml-1 text-gray-400 cursor-pointer text-sm"
        onClick={handleIconClick}
      />
       </Tooltip>
      {isFilterOpen && (
        <input
          ref={inputRef}
          type="text"
          className="w-32 h-5 p-1 border border-gray-300 rounded font-roboto font-light text-gray-600"
          value={filterConfig[header] || ""}
          onChange={(e) => handleFilterChange(header, e.target.value)}
        />
      )}
    </div>
  );
};

export default Filter;
