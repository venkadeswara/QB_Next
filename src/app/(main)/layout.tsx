"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import { AboutIcon, ConfigurationIcon, HistoryIcon, LogoutIcon, PasswordIcon, QueryIcon, SchedulesIcon, } from "../components/svgicons";
import Tooltip from "../components/Tooltip";
import { LogoutApi } from "../../api/route";


export default function NavBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiBaseAuthentication = process.env.NEXT_PUBLIC_API_BASE_AUTHENTICATION;
  const [opens, setOpens] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showlist, setshowlist] = useState(false);
  const dropdownRefs = useRef(null);
  const iconRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const colorPaletteRef = useRef(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const { color, setColor, theadcolor, settheadcolor, tbodycolor, settbodycolor, isDarkMode, toggleDarkMode, tbodyfullcolor, settbodyfullcolor } = useTheme();
  const handleColorChange = (newColor: string, newtheadcolor: string, newtbodycolor: string, newtobdyfullcolor: string) => {
    setColor(newColor);
    settheadcolor(newtheadcolor);
    settbodycolor(newtbodycolor)
    settbodyfullcolor(newtobdyfullcolor);
    setShowColorPalette(false);
  };
  const toggleColorPalette = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowColorPalette(!showColorPalette);
  };
  const toggleactivity = () => {
    setshowlist(!showlist);
  };
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(target) &&
      iconRef.current &&
      !iconRef.current.contains(target)
    ) {
      setshowlist(false);
    }
    if (
      colorPaletteRef.current &&
      !(colorPaletteRef.current as any).contains(event.target)
    ) {
      setShowColorPalette(false);
    }
    if (
      dropdownRefs.current &&
      !(dropdownRefs.current as any).contains(event.target)

    ) {
      setOpens(false);
    }

  };
  const getCookieValue = (name: string): string | null => {
    if (typeof window !== "undefined") {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift() ?? null;
      }
    }
    return null;
  };  
  const tokenValue = getCookieValue("User"); 
  useEffect(() => {
    const fetchLogoutData = async () => {
      try {
        const targetUrl = `${apiBaseAuthentication}#logout`;
        const response = await fetch(targetUrl, {
          method: "GET",
          credentials:"include",
          headers: {
            Accept: "application/json",
          },
        }); 
        if (!response.ok) {          
          return response.statusText;
        } 
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const token = doc.querySelector('meta[name="_csrf"]')?.getAttribute("content"); 
        if (token) {          
          setCsrfToken(token);
        } else {
          console.error("CSRF token not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    }; 
    fetchLogoutData();
  }, [tokenValue]);

 

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const currentPath = window.location.pathname;
  if (currentPath.includes("Schedule")) {
    setActiveLink("/schedules");
  }
  else if (currentPath.startsWith("/queries")) {
    setActiveLink("/queries");
  }
  else if(currentPath.startsWith("/schedules")){
    setActiveLink("/schedules");
  }
  else if(currentPath.startsWith("/history")){
    setActiveLink("/history");
  }
  else if(currentPath.startsWith("/edit-views")){
    setActiveLink("/edit-views");
  }
  else{
  }
}, []);
  const toggleMenu = () => {
    setOpens(!opens);
  };
  const handleOptionClick = () => {
    setOpens(false);
  };
  const payloads = {
    reason: "You have been logged out",
    _csrf: csrfToken,
  };
  const handleLogoutClick = async () => {
    const rest = await LogoutApi(payloads); 
    if (rest === 200) {      
      setCsrfToken(null);
      window.history.replaceState(null, "", window.location.href);
      window.location.replace("/login");
    }
  };


  return (
    <div className="w-full h-screen flex flex-col fixed">
      <section className=" flex-1 flex flex-col">
        <div
          className="w-full pl-2 pr-2 h-[50px] flex justify-between items-center  shadow-md"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center space-x-12 ml-9">
          {/* <Tooltip tooltipText="Switch Module" position="right" marginClass="ml-2" > */}
          <span ref={iconRef}>
            <FontAwesomeIcon
              icon={faBars}
              className="w-6 h-6 text-white"
              onClick={toggleactivity}
            />
            </span>
            {/* </Tooltip> */}
            {showlist && (
              <ul
                ref={dropdownRef}
                style={{ marginLeft: '-35px', backgroundColor: tbodycolor, zIndex: 50 }}
                className="absolute  mt-60 w-44 bg-white border border-gray-200 rounded-md shadow-lg animate-slideInFromLeft"
              >
                <li className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${isDarkMode ? 'text-white' : ''}`} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor} style={{ backgroundColor: tbodycolor }}>
                  Spares
                </li>
                <li className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${isDarkMode ? 'text-white' : ''}`} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor} style={{ backgroundColor: tbodycolor }}>
                  Document
                </li>
                <li className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${isDarkMode ? 'text-white' : ''}`} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor} style={{ backgroundColor: tbodycolor }}>
                  Approvals
                </li>
                <li className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${isDarkMode ? 'text-white' : ''}`} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor} style={{ backgroundColor: tbodycolor }}>
                  Dashboard
                </li>
                <li className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${isDarkMode ? 'text-white' : ''}`} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor} style={{ backgroundColor: tbodycolor }}>
                  Retirements
                </li>
              </ul>
            )}
            <div className=" flex items-center space-x-4">
            <Link href={"/Dashboard"}>
              <Image
                className="w-[40px] h-[30px]"
                src="/Query-Builder.png"
                alt="catsqb logo"
                width={150}
                height={40}
              />
            </Link>
            <p className=" text-white text-xl">
              <strong>
                <span className="-ml-3 font-roboto">Queries Studio</span>
              </strong>
            </p>
            </div>
          </div>
          <div className="relative" ref={dropdownRefs}>
            <div
              className="flex items-center cursor-pointer  p-2"
              onClick={toggleMenu}
            >
              <Image src="/avater.png" alt="Avatar" width={40} height={40} />
              <span className="ml-2 text-white text-l font-light font-roboto">
                CATSADM
              </span>
            </div>

            {opens && (

              <div
                className="absolute right-0 mt-2 w-64 bg-gray-400 text-gray-600 rounded-lg p-4 animate-slideInFromTop shadow-custom-light ${isDarkMode ? 'shadow-custom-dark' : ''}"
                style={{ backgroundColor: tbodycolor, zIndex: 100 }}
              >
                <div
                  className="absolute top-0 right-0 -mt-2 mr-28 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8"
                  style={{ borderBottomColor: color }}
                ></div>

                <ul className="space-y-2">
                  <li>
                    <Link href="/password-change">

                      <div
                        className={`flex items-center cursor-pointer ml-5 text-gray-600 font-roboto font-light ${isDarkMode ? 'text-white' : ''
                          }`}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theadcolor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tbodycolor)}
                        style={{ backgroundColor: tbodycolor }}
                        onClick={() => {
                          handleOptionClick(); 
                          setActiveLink("/password-change");
                      }}
                      >
                        <PasswordIcon className="w-4 h-4 mr-2 group-hover:text-black" />
                        Password Change
                      </div>

                    </Link>
                  </li>

                  <li>
                    <Link href="/about">

                      <div className={`flex items-center cursor-pointer ml-5 text-gray-600 font-roboto font-light hover:bg-gray-300  ${isDarkMode ? 'text-white' : ''}`}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                        style={{ backgroundColor: tbodycolor }}
                        onClick={() => {
                          handleOptionClick(); 
                          setActiveLink("/about");
                      }}
                      >
                        <AboutIcon className="w-4 h-4 mr-2 group-hover:text-black" />
                        About
                      </div>

                    </Link>
                  </li>
                  <li>               
                      <div className={`flex items-center cursor-pointer ml-5 text-gray-600 font-roboto font-light  hover:bg-gray-300 ${isDarkMode ? 'text-white' : ''}`}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                        style={{ backgroundColor: tbodycolor }}
                        onClick={handleLogoutClick}
                      >
                        <LogoutIcon
                          className="w-4 h-4 mr-2 group-hover:text-black"
                        /> Logout</div>                   
                  </li>
                  <hr className="border-t-2 border-gray-600" />

                  <div className="flex justify-center space-x-4">
                    <div
                      className={`w-4 h-4 bg-[#99A3A3] cursor-pointer border-2 border-transparent hover:border-white ${isDarkMode ? 'opacity-50' : ''}`}
                      style={isDarkMode ? { cursor: 'not-allowed' } : {}}
                      onClick={() => !isDarkMode && handleColorChange("#99A3A3", "#E0E5E5", "#F5F5F5", "#F5F5F5")}
                    ></div>
                    <div
                      className={`w-4 h-4 bg-[#848482] cursor-pointer border-2 border-transparent hover:border-white ${isDarkMode ? 'opacity-50' : ''}`}
                      style={isDarkMode ? { cursor: 'not-allowed' } : {}}
                      onClick={() => !isDarkMode && handleColorChange("#848482", "#CECECE", "#EEEEEE", "#F5F5F5")}
                    ></div>
                    <div
                      className={`w-4 h-4 bg-[#BEA7A7] cursor-pointer border-2 border-transparent hover:border-white ${isDarkMode ?  'opacity-50' : ''}`}
                      style={isDarkMode ? { cursor: 'not-allowed' } : {}}
                      onClick={() => !isDarkMode && handleColorChange("#BEA7A7", "#DFD3D3", "#F5F0F0", "#F4F0F0")}
                    ></div>
                  </div>
                  <div className="flex justify-center">
                    <span className={`mr-8 ${isDarkMode ? 'text-white' : ''}`}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        className="sr-only"
                      />
                      <div className="w-11 h-6 bg-sky-700 rounded-full shadow-inner"></div>
                      <div
                        className={`dot absolute left-1 top-1 w-4 h-4 bg-slate-100 rounded-full shadow transition transform ${isDarkMode ? 'translate-x-5' : ''}`}
                      ></div>
                    </label>
                  </div>
                </ul>
              </div>
            )}
          </div>
        </div>


        <div className="flex flex-1   text-l font-light">
          <div
            className="w-28"
            style={{ backgroundColor: color }}
          >

            <ul className="flex flex-col text-white">
              <Link href="/queries">
              {/* <Tooltip tooltipText="Queries" position="right" marginClass="-ml-1"> */}
                <li
                  className={`m-2 p-2 flex flex-col items-center hover:bg-white ${activeLink === "/queries"
                      ? "bg-white text-gray-600"
                      : ""
                    }`}
                  onClick={() => setActiveLink("/queries")}
                  style={{ backgroundColor: activeLink === "/queries" ? theadcolor : 'inherit' }}
                >
                 < QueryIcon
                     className={` mb-2 ${activeLink === "/queries" ? "text-gray-600" : ""} ${isDarkMode ? 'text-white' : ''}`} />   
                    <div className={`font-roboto text-sm ${isDarkMode ? 'text-white' : ''}`}>

                      Queries
                    </div>
                  </li>
                {/* </Tooltip> */}
              </Link>

              <Link href="/schedules">

              {/* <Tooltip tooltipText="Schedule" position="right" marginClass="-ml-1"> */}
              <li
                  className={`m-2 p-2 flex flex-col items-center hover:bg-white ${activeLink === "/schedules"
                      ? "bg-white text-gray-600"
                      : ""
                    }`}
                  onClick={() => setActiveLink("/schedules")}
                  style={{ backgroundColor: activeLink === "/schedules" ? theadcolor : 'inherit' }}
             >              
             <SchedulesIcon
             className={` mb-2  ${activeLink === "/schedules" ? "text-gray-600"  :  ""} ${isDarkMode ? 'text-white' : ''}`}
             />
               <div className={`font-roboto text-sm ${isDarkMode ? 'text-white' : ''}`}>
             Schedule              
    </div>
  </li>
  {/* </Tooltip> */}
</Link>

              <Link href="/history">
              {/* <Tooltip tooltipText="History" position="right" marginClass="-ml-1"> */}
                <li
                  className={`m-2 p-2 flex flex-col items-center hover:bg-white ${activeLink === "/history"
                      ? "bg-white text-gray-600 "
                      : ""
                      }`}
                    onClick={() => setActiveLink("/history")}
                    style={{ backgroundColor: activeLink === "/history" ? theadcolor : 'inherit' }}
                  >

                    < HistoryIcon
                      className={`mb-2  ${activeLink === "/history" ? "text-gray-600 " : ""}${isDarkMode ? 'text-white' : ''}  `}
                    
                    />

                    <div className={`font-roboto text-sm ${isDarkMode ? 'text-white' : ''}`}>
                      History
                    </div>
                  </li>
                {/* </Tooltip> */}
              </Link>

              <Link href="/edit-views">
              {/* <Tooltip tooltipText="View Configurations" position="right" marginClass="-ml-1"> */}
                <li
                  className={`m-2 p-2 flex flex-col items-center hover:bg-white ${activeLink === "/edit-views"
                      ? "bg-white text-gray-600 "

                      : ""
                      }`}
                    onClick={() => setActiveLink("/edit-views")}
                    style={{ backgroundColor: activeLink === "/edit-views" ? theadcolor : 'inherit' }}
                  >

                    <ConfigurationIcon
                      className={`mb-2  ${activeLink === "/edit-views" ? "text-gray-600 " : ""} ${isDarkMode ? 'text-white' : ''}`} />

                    <div className={`font-roboto text-sm ${isDarkMode ? 'text-white' : ''}`}>
                      <span className="ml-6"> View </span>  Configuration
                    </div>
                  </li>
                {/* </Tooltip> */}
              </Link>
            </ul>
          </div>
          <div className="ml-0 mr-0  flex-1  bg-[#F5F5F5] overflow-auto" style={{ backgroundColor: tbodyfullcolor }}>
            <div className="h-6">{children}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
