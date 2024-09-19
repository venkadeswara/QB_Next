"use client";
import { CheckSchedules,  Fillters, view } from "@/api/route";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import GenericTable from "@/app/components/Table";
import Link from "next/link";
import SpinnerTest from "@/app/components/spinnerTest";
import { useTheme } from "@/app/components/ThemeContext";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import Tooltip from "@/app/components/Tooltip";
interface CheckschedulesItem {
  id: number;
  title: string;
  description: string;
  email: string;
  contactId: number;
  frequency: string;
  active: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const { theadcolor, isDarkMode } = useTheme();
  const [header, setHeader] = useState<ViewData[]>([]);
  const [viewhead, setViewHead] = useState<FilterData | null>(null);
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
        const response = await CheckSchedules(viewId, id);
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
          setCheckscheduleList(mappedCheckSchedules);
          if (mappedCheckSchedules.length > 0) {
          }
        } else {
          setCheckscheduleList([]);
        }
      } catch (error) {
        setCheckscheduleList([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchScheduleData(viewId, id);
  }, [viewId, id]);


  if (isLoading) {
    return <div><SpinnerTest /></div>;
  }
  return (
    <div>

      <div className="p-3" style={{ backgroundColor: theadcolor }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {header.map((item, index) => (
            <h1 key={index} className={`text-gray-600 font-bold ${isDarkMode ? 'text-white' : ''}`}>
              {toPascalCaseWithSpaces(item.description)}
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
        <div>
          <h2 className={`text-xl font-bold mb-5 text-gray-600 ${isDarkMode ? 'text-white' : ''}`}> Schedules for Filter: {viewhead ? toPascalCaseWithSpaces(viewhead.name) : 'No Filter Selected'}</h2>
          <GenericTable
            data={checkscheduleList.map((schedule) => ({
              title:schedule.title,
              id:schedule.id,
              active: schedule.active ? "YES" : "NO",
              frequency: schedule.frequency,
            }))}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
