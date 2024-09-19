"use client"
import { useState, useEffect } from "react";
import { toPascalCaseWithSpaces } from "./formatting";

interface SortConfig<T> {
  key: keyof T;
  direction: "ascending" | "descending";
}

export function useSortableData<T>(items: T[],defaultSortKey: keyof T,sortOrder: 'mixed' | 'default' = 'default') {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
  key: defaultSortKey,
  direction: sortOrder === 'mixed' ? "descending" : "ascending",
});
  const [sortedItems, setSortedItems] = useState<T[]>(items);

  const requestSort = (key: keyof T) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const { key, direction } = sortConfig;
    let sortableItems = [...items];
    
      sortableItems.sort((a, b) => {
        if (
          typeof a[key] === "string" &&
          typeof b[key] === "string" &&
          !isNaN(Date.parse(a[key] as unknown as string))
        ) {
         
          const dateA = new Date(a[key] as unknown as string);
          const dateB = new Date(b[key] as unknown as string);
   
          const timeA = dateA.getTime();
          const timeB = dateB.getTime();
   
         
          return direction === "descending" ? timeA - timeB : timeB - timeA;
        } else if (typeof a[key] === "string" && typeof b[key] === "string") {

          const formattedA = toPascalCaseWithSpaces(a[key]);
          const formattedB = toPascalCaseWithSpaces(b[key]);
         
          if (formattedA < formattedB) {
            return direction === "ascending" ? -1 : 1;
          }
          if (formattedA > formattedB) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
        return 0;
      });
    
    setSortedItems(sortableItems);
  }, [items, sortConfig]);

  return { items: sortedItems, requestSort, sortConfig };
}
