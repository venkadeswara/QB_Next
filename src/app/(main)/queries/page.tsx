"use client";
import { views } from "@/api/route";
import SpinnerTest from "@/app/components/spinnerTest";
import GenericTable from "@/app/components/Table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/app/components/ThemeContext";

interface ViewItem {
  id: number;
  description: string;
}

const queriescolumnname = {
  id: "id",
  description: "Available Views",
};

function queriescolumnmap(item: any): any {
  return {
    [queriescolumnname.description]: item.description,
    [queriescolumnname.id]: item.id,
  };
}

const toPascalCaseWithSpaces = (str: any) => {
  if (typeof str !== "string") {
    return str; // Return the value as is if it's not a string
  }

  return str
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
};

export default function Queries() {
  const [viewsList, setViewsList] = useState<ViewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode} = useTheme();

  useEffect(() => {
    async function fetchViews() {
      try {
        const response = await views();
        if (response && Array.isArray(response)) {
          const mappedViews = response.map(queriescolumnmap);
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

    fetchViews();
  }, []);

  if (isLoading) {
    return <div><SpinnerTest/></div>;
  }

  if (viewsList.length === 0) {
    return <div><h1 className={`flex items-center justify-center h-screen text-[#848482]  ${isDarkMode ? 'text-white' : ''}`}>No data found</h1></div>;
  }

  const headers = ["Available Views"];

  return (
    <div className="mt-4 fixed top-10 w-[93vw]">
      <GenericTable data={viewsList} isLoading={isLoading} headers={headers} />
    </div>
  );
}
