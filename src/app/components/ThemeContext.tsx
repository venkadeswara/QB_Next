"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface ThemeContextType {
  color: string;
  setColor: (color: string) => void;
  theadcolor: string;
  settheadcolor: (theadcolor: string) => void;
  tbodycolor: string;
  settbodycolor: (tbodycolor: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  tbodyfullcolor: string;
  settbodyfullcolor: (tbodyfullcolor: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize state with default values
  const [color, setColor] = useState<string>("#99A3A3");
  const [theadcolor, settheadcolor] = useState<string>("#E0E5E5");
  const [tbodycolor, settbodycolor] = useState<string>("#F5F5F5");
  const [tbodyfullcolor, settbodyfullcolor] = useState<string>("#F5F5F5");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedIsDarkMode = localStorage.getItem("isDarkMode") === "true";
    const storedColor = localStorage.getItem("color") || (storedIsDarkMode ? "#212121" : "#99A3A3");
    const storedTheadColor = localStorage.getItem("theadcolor") || (storedIsDarkMode ? "#3A3B3C" : "#E0E5E5");
    const storedTbodyColor = localStorage.getItem("tbodycolor") || (storedIsDarkMode ? "#454545" : "#F5F5F5");
    const storedTbodyFullColor = localStorage.getItem("tbodyfullcolor") || (storedIsDarkMode ? "#4d4d4f" : "#F5F5F5");

    setIsDarkMode(storedIsDarkMode);
    setColor(storedColor);
    settheadcolor(storedTheadColor);
    settbodycolor(storedTbodyColor);
    settbodyfullcolor(storedTbodyFullColor);
    setIsLoaded(true);
  }, []);
 
  // Sync state with localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("isDarkMode", isDarkMode.toString());
      localStorage.setItem("color", color);
      localStorage.setItem("theadcolor", theadcolor);
      localStorage.setItem("tbodycolor", tbodycolor);
      localStorage.setItem("tbodyfullcolor", tbodyfullcolor);
    }
  }, [isDarkMode, color, theadcolor, tbodycolor, tbodyfullcolor, isLoaded]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      setColor("#212121");
      settheadcolor("#3A3B3C");
      settbodycolor("#454545");
      settbodyfullcolor("#4d4d4f");
    } else {
      setColor("#99A3A3");
      settheadcolor("#E0E5E5");
      settbodycolor("#F5F5F5");
      settbodyfullcolor("#F5F5F5");

    }
  };

  if (!isLoaded) {
    return null; // Render nothing or a loader until theme is loaded
  }

  return (
    <ThemeContext.Provider
      value={{color,setColor,theadcolor,settheadcolor,tbodycolor,settbodycolor,isDarkMode,
      toggleDarkMode,tbodyfullcolor,settbodyfullcolor,}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};