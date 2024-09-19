'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  AboutIcon,
  ConfigurationIcon,
  HistoryIcon,
  LogoutIcon,
  PasswordIcon,
  QueryIcon,
  SchedulesIcon,
} from '../components/svgicons';
import Tooltip from '../components/Tooltip';
import LoginForms from './loginforms';


export default function NavBar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [opens, setOpens] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showlist, setShowlist] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const dropdownRefs = useRef<HTMLDivElement | null>(null);
  const colorPaletteRef = useRef<HTMLDivElement | null>(null);
  const {
    color,
    setColor,
    theadcolor,
    settheadcolor,
    tbodycolor,
    settbodycolor,
    isDarkMode,
    toggleDarkMode,
    tbodyfullcolor,
    settbodyfullcolor,
  } = useTheme();

  const handleColorChange = (
    newColor: string,
    newTheadColor: string,
    newTbodyColor: string,
    newTbodyFullColor: string
  ) => {
    setColor(newColor);
    settheadcolor(newTheadColor);
    settbodycolor(newTbodyColor);
    settbodyfullcolor(newTbodyFullColor);
    setShowColorPalette(false);
  };

  const toggleColorPalette = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowColorPalette(!showColorPalette);
  };

  const toggleActivity = () => {
    setShowlist(!showlist);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowlist(false);
    }
    if (
      colorPaletteRef.current &&
      !colorPaletteRef.current.contains(event.target as Node)
    ) {
      setShowColorPalette(false);
    }
    if (
      dropdownRefs.current &&
      !dropdownRefs.current.contains(event.target as Node)
    ) {
      setOpens(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  }, []);

  const toggleMenu = () => {
    setOpens(!opens);
  };

  const handleOptionClick = () => {
    setOpens(false);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <section className="flex-1 flex flex-col">
        <div
          className="w-full pl-2 pr-2 h-[50px] flex justify-between items-center shadow-md"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center space-x-4 ml-8">
            <FontAwesomeIcon
              icon={faBars}
              className="w-6 h-6 text-white"
              onClick={toggleActivity}
            />
            {showlist && (
              <ul
                ref={dropdownRef}
                style={{ marginLeft: '-35px', backgroundColor: tbodycolor, zIndex: 50 }}
                className="absolute mt-60 w-44 bg-white border border-gray-200 rounded-md shadow-lg animate-slideInFromLeft"
              >
                <li
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${
                    isDarkMode ? 'text-white' : ''
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                  style={{ backgroundColor: tbodycolor }}
                >
                  Spares
                </li>
                <li
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${
                    isDarkMode ? 'text-white' : ''
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                  style={{ backgroundColor: tbodycolor }}
                >
                  Document
                </li>
                <li
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${
                    isDarkMode ? 'text-white' : ''
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                  style={{ backgroundColor: tbodycolor }}
                >
                  Approvals
                </li>
                <li
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${
                    isDarkMode ? 'text-white' : ''
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                  style={{ backgroundColor: tbodycolor }}
                >
                  Dashboard
                </li>
                <li
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-roboto ${
                    isDarkMode ? 'text-white' : ''
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theadcolor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tbodycolor}
                  style={{ backgroundColor: tbodycolor }}
                >
                  Retirements
                </li>
              </ul>
            )}
            <Link href="/Dashboard">
              <Image
                className="w-[40px] h-[30px] ml-8"
                src="/Query-Builder.png"
                alt="catsqb logo"
                width={150}
                height={40}
              />
            </Link>
            <p className="text-white text-xl">
              <strong>
                <span className="-ml-3 font-roboto">Queries Studio</span>
              </strong>
            </p>
          </div>
        </div>
        <div className="mt-10">{children} </div>
      </section>
    </div>
  );
}
