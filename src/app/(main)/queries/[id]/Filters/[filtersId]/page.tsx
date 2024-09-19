"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Fillters,
  Summary,
  Testfilter,
  view,
  SaveFilter,
  FillterDelete,
} from "@/api/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faCancel,
  faCheck

} from "@fortawesome/free-solid-svg-icons";
import { faFlask } from "@fortawesome/free-solid-svg-icons/faFlask";
import Link from "next/link";
import { toPascalCaseWithSpaces } from "@/app/components/formatting";
import SpinnerTest from "@/app/components/spinnerTest";
import { useTheme } from "@/app/components/ThemeContext";
import { CancelIcon, DeleteIcon, MinusIcon, PlusIcon, SaveIcon,PrivateIcon,FavouriteIcon,OkIcon } from "@/app/components/svgicons";
import Tooltip
  from "@/app/components/Tooltip";
interface ViewData {
  description: string;
  columnName: string;
  dataType: string;
}
interface Clause {
  combineMethod?: string;
  column: string;
  operator: string;
  value1: string;
  value2: string | null;
}
interface order {
  column: string;
  direction: string;
}
interface ViewItem {
  name: string;
  description: string;
  data: {
    display: string[];
    clauses: Clause[];
    order: order[];
  };
  columns: Array<{
    columnName: string;
    dataType: string;
  }>;
  favorite: boolean;
  privateFilter: boolean;
  addContactId: number;
}
export default function Filtersdata() {
  const pathname = usePathname();
  const [viewData, setViewData] = useState<{
    field1: ViewItem;
    field2: ViewItem;
  }>({
    field1: {
      name: "",
      description: "",
      data: { display: [], clauses: [], order: [] },
      columns: [],
      favorite: false,
      privateFilter: false,
      addContactId: 0,
    },
    field2: {
      name: "",
      description: "",
      data: { display: [], clauses: [], order: [] },
      columns: [],
      favorite: false,
      privateFilter: false,
      addContactId: 0,
    },
  });
  const [showTestTable, setShowTestTable] = useState(false);
  const [showAdditionalBox, setShowAdditionalBox] = useState(true);
  const [header, setHeader] = useState<ViewData[]>([]);
  const [isSummaryReport, setIsSummaryReport] = useState(false);
  const [testTableHeaders, setTestTableHeaders] = useState<string[]>([]);
  const [testTableData, setTestTableData] = useState<any[]>([]);
  const [summaryTableHeaders, setSummaryTableHeaders] = useState<string[]>([]);
  const [summaryTableData, setSummaryTableData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentField, setCurrentField] = useState<"field1" | "field2">(
    "field1"
  );
  const [operatorsList, setOperatorsList] = useState<
    { id: string; name: string }[][]
  >(Array(viewData[currentField].data.clauses.length).fill([]));
  const { theadcolor, color, isDarkMode } = useTheme();
  const [column, setColumn] = useState("");
  const [operator, setOperator] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [direction, setDirection] = useState("");
  const [combineMethod, setcombineMethod] = useState("");
  const [rows, setRows] = useState({
    field1: [{}],
    field2: [{}],
  });
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortRows, setSortRows] = useState({
    field1: [{}],
    field2: [{}],
  });
  const [totalRecordsCount, setTotalRecordsCount] = useState(null);
  const [errors, setErrors] = useState({ name: "", description: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const pathParts = pathname.split("/");
  const viewId = parseInt(pathParts[2]);
  const router = useRouter();
  const id = pathParts[4] === "new" ? 0 : parseInt(pathParts[4]);
  const getOperators = (dataType: any) => {
    switch (dataType) {
      case "STRING":
        return [
          { id: "IS", name: "equals" },
          { id: "IS_NOT", name: "not equal to" },
          { id: "IS_IN", name: "is in this list" },
          { id: "IS_PROVIDED", name: "is not null" },
          { id: "IS_NOT_PROVIDED", name: "is null" },
          { id: "CONTAINS", name: "contains" },
          { id: "NOT_CONTAINS", name: "does not contain" },
          { id: "STARTS_WITH", name: "starts with" },
          { id: "ENDS_WITH", name: "ends with" },
        ];
      case "NUMBER":
        return [
          { id: "IS", name: "equals" },
          { id: "IS_NOT", name: "not equal to" },
          { id: "IS_IN", name: "is in this list" },
          { id: "IS_PROVIDED", name: "is not null" },
          { id: "IS_NOT_PROVIDED", name: "is null" },
          { id: "LT", name: "less than" },
          { id: "LTE", name: "less than or equal to" },
          { id: "GT", name: "greater than" },
          { id: "GTE", name: "greater than or equal to" },
          { id: "BETWEEN", name: "between" },
        ];
      case "DATE":
        return [
          { id: "IS", name: "equals" },
          { id: "IS_NOT", name: "not equal to" },
          { id: "IS_PROVIDED", name: "is not null" },
          { id: "IS_NOT_PROVIDED", name: "is null" },
          { id: "LT", name: "less than" },
          { id: "LTE", name: "less than or equal to" },
          { id: "GT", name: "greater than" },
          { id: "GTE", name: "greater than or equal to" },
          { id: "BETWEEN", name: "between" },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (viewData[currentField] && id !== 0) {
      const clauseCount = viewData[currentField].data.clauses.length || 1;
      const orderCount = viewData[currentField].data.order.length || 1;
      setRows((prevRows) => ({
        ...prevRows,
        [currentField]: new Array(clauseCount).fill({}),
      }));
      setSortRows((prevSortRows) => ({
        ...prevSortRows,
        [currentField]: new Array(orderCount).fill({
          column: "",
          direction: "ASC",
        }),
      }));
      setShowOptions(clauseCount > 1);
    }
  }, [viewData, currentField, id]);

  const handleToggleFields = () => {
    setShowAdditionalBox((prevState) => !prevState);
    setShowTestTable(false);
  };
  const handleTestTable = () => {
    setShowTestTable(true);
    setShowAdditionalBox(false);
    setTotalRecordsCount(null);
  };
  const handleSummaryReport = () => {
    setIsSummaryReport(true);
    setCurrentField("field2");
    setShowTestTable(false);
    setShowAdditionalBox(true);
    setTotalRecordsCount(null);
  };
  const handleFilterReport = () => {
    setCurrentField("field1");
    setIsSummaryReport(false);
  };
  const handleCancelClick = () => {
    if (isChanged) {
      setRedirectUrl(`/queries/${viewId}`);
      setShowCancel(true);
    } else {
      router.push(`/queries/${viewId}`);
    }
  };
  const handleOkayClick = () => {
    setShowCancel(false);
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };
  const handleConfirmDelete=async (id:number,viewId:number)=>{  
    const result = await FillterDelete(id,viewId);    
  }
  const handleNoClick = () => {
    setShowCancel(false);
  };
  useEffect(() => {
    if (!isSummaryReport) {
      const allItems = new Set(viewData[currentField].data.display);
      setSelectedItems(allItems);
    } else {
      setSelectedItems(new Set());
    }
  }, [isSummaryReport,currentField, viewData]);
  useEffect(() => {
    async function fetchViews(viewId: number, id: number) {
      const columndata = await view(viewId);
      if (columndata) {
        const description = columndata.description;
        const columnName = columndata.columnName;
        const dataType = columndata.dataType;
        setHeader([{ description, columnName, dataType }]);
      }
      try {
        if (id === 0) {
          if (columndata && Array.isArray(columndata.columns)) {
            const columnNames = columndata.columns.map(
              (item: ViewData) => item.columnName
            );

            setViewData((prevData) => {
              return {
                ...prevData,
                field1: {
                  ...prevData.field1,
                  data: {
                    display: columnNames,
                    clauses: [],
                    order: [],
                  },
                  columns: columndata.columns,
                },
                field2: {
                  ...prevData.field2,
                  data: {
                    display: columnNames,
                    clauses: [],
                    order: [],
                  },
                  columns: columndata.columns,
                },
              };
            });
          } else {
            console.error(
              "Expected columns to be an array:",
              columndata.columns
            );
          }

          return;
        }
        const response = await Fillters(viewId, id);

        const columns = columndata.columns.map((item: ViewData) => ({
          columnName: item.columnName,
          dataType: item.dataType,
        }));

        const clauseDataTypes = response.data.clauses
          .map((clause: any) => {
            const matchingColumn = columns.find(
              (column: any) => column.columnName === clause.column
            );
            return matchingColumn ? matchingColumn.dataType : null;
          })
          .filter((dataType: string | null) => dataType !== null) as string[];
        const operatorsMapping = clauseDataTypes.map((dataType) =>
          getOperators(dataType)
        );
        const formattedOperators: { id: string; name: string }[][] =
          operatorsMapping.map((operatorArray) => {
            return operatorArray;
          });
        setOperatorsList(formattedOperators);

        if (response && response.name && response.description) {
          setViewData((prevData) => ({
            ...prevData,
            field1: {
              ...prevData[currentField],
              name: response.name,
              description: response.description,
              data: response.data,
              columns: columns,
              addContactId: response.addContactId || 0,
              privateFilter: response.privateFilter,
              favorite: response.favorite,
            },
            field2: {
              ...prevData[currentField],
              name: response.name,
              description: response.description,
              data: response.data,
              columns: columns,
              addContactId: response.addContactId || 0,
              privateFilter: response.privateFilter,
              favorite: response.favorite,
            },
          }));
        } else {
          setViewData((prevData) => ({
            ...prevData,
            [currentField]: {
              name: "",
              description: "",
              data: { display: [], clauses: [], order: [] },
              columns: prevData[currentField].columns,
              addContactId: 0,
            },
          }));
        }
      } catch (error) {
        setViewData((prevData) => ({
          ...prevData,
          [currentField]: {
            name: "",
            description: "",
            data: { display: [], clauses: [], order: [] },
            columns: prevData[currentField].columns,
            addContactId: 0,
          },
        }));
      } finally {
        setIsLoading(false);
      }
    }
    fetchViews(viewId, id);
  }, [viewId, id, currentField]);
  const addRow = () => {
    setRows((prevRows) => ({
      ...prevRows,
      [currentField]: [...prevRows[currentField], {}],
    }));
    setShowOptions(true);
  };
  const addSortRow = () => {
    setSortRows((prevSortRows) => ({
      ...prevSortRows,
      [currentField]: [
        ...prevSortRows[currentField],
        { column: "", direction: "ASC" },
      ],
    }));
  };
  const removeRow = (index: number) => {
    setRows((prevRows) => ({
      ...prevRows,
      [currentField]:
        prevRows[currentField].length === 1
          ? [{}]
          : prevRows[currentField].filter((_, i) => i !== index),
    }));

    setViewData((prevData) => ({
      ...prevData,
      [currentField]: {
        ...prevData[currentField],
        data: {
          ...prevData[currentField].data,
          clauses:
            prevData[currentField].data.clauses.length === 1
              ? [{}] 
              : prevData[currentField].data.clauses.filter((_, i) => i !== index),
        },
      },
    }));

    setOperatorsList((prevOperatorsList) =>
      index === 0 && prevOperatorsList.length > 1
        ? [prevOperatorsList[1], ...prevOperatorsList.slice(2)]
        : prevOperatorsList.filter((_, i) => i !== index)
    );
  };

  const removeSortRow = (index: number) => {
    setSortRows((prevSortRows) => {
      const updatedRows = prevSortRows[currentField].filter((_, i) => i !== index);
      const rowsToReturn = updatedRows.length > 0 ? updatedRows : [{}];
      return {
        ...prevSortRows,
        [currentField]: rowsToReturn,
      };
    });

    setViewData((prevData) => {
      const updatedOrder = prevData[currentField].data.order.filter((_, i) => i !== index);
      const orderToReturn = updatedOrder.length > 0 ? updatedOrder : [{}];
      return {
        ...prevData,
        [currentField]: {
          ...prevData[currentField],
          data: {
            ...prevData[currentField].data,
            order: orderToReturn,
          },
        },
      };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const [type, index] = name.split("-");
    const idx = parseInt(index, 10);

    if (!viewData[currentField]) return;

    const updatedClauses = [...viewData[currentField].data.clauses];
    const updatedOrder = [...viewData[currentField].data.order];
    const updatedOperatorsList = [...operatorsList];

    switch (type) {
      case "combineMethod":
        updatedClauses[idx] = { ...updatedClauses[idx], combineMethod: value };
        break;
      case "column":
        updatedClauses[idx] = { ...updatedClauses[idx], column: value };

        const selectedColumnData = viewData[currentField].columns.find(
          (column) => column.columnName === value
        );

        if (selectedColumnData) {
          const operators = getOperators(selectedColumnData.dataType);
          updatedOperatorsList[idx] = operators;
        }
        break;
      case "operator":
        updatedClauses[idx] = { ...updatedClauses[idx], operator: value };
        break;
      case "value1":
        updatedClauses[idx] = { ...updatedClauses[idx], value1: value };
        break;
      case "value2":
        updatedClauses[idx] = { ...updatedClauses[idx], value2: value };
        break;
      case "orderColumn":
        if (!updatedOrder[idx]) {
          updatedOrder[idx] = { column: "", direction: "" };
        }
        updatedOrder[idx] = { ...updatedOrder[idx], column: value };
        break;
      case "orderSort":
        if (!updatedOrder[idx]) {
          updatedOrder[idx] = { column: "", direction: "" };
        }
        updatedOrder[idx] = { ...updatedOrder[idx], direction: value };
        break;
      default:
        break;
    }

    setViewData((prevViewData) => ({
      ...prevViewData,
      [currentField]: {
        ...prevViewData[currentField],
        data: {
          ...prevViewData[currentField].data,
          clauses: updatedClauses,
          order: updatedOrder,
        },
      },
    }));

    setOperatorsList(updatedOperatorsList);
    setIsChanged(true);
  };

  const handleCheckboxChange = (item: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(item)) {
        newSelectedItems.delete(item);
      } else {
        newSelectedItems.add(item);
      }
      return newSelectedItems;
    });
    setIsChanged(true);
  };
  const generatePayload = (updatedViewData: any) => {
    return {
      id: null,
      viewId: viewId,
      name: updatedViewData[currentField].name,
      data: {
        display: Array.from(selectedItems),
        clauses: updatedViewData[currentField].data.clauses,
        order: updatedViewData[currentField].data.order,
      },
      favorite: updatedViewData[currentField].favorite,
      privateFilter: updatedViewData[currentField].privateFilter,
      description: updatedViewData[currentField].description,
    };
  };
  const updateViewData = async () => {
    return new Promise((resolve) => {
      setViewData((prevData) => {
        if (!prevData[currentField]) {
          resolve(prevData);
          return prevData;
        }

        const updatedClauses = prevData[currentField].data.clauses.map(
          (clause) => {
            if (
              clause.column === column &&
              clause.operator === operator &&
              clause.combineMethod === combineMethod
            ) {
              return {
                ...clause,
                value1: value1,
                value2: null,
              };
            }
            return clause;
          }
        );

        const clauseExists = updatedClauses.some(
          (clause) =>
            clause.column === column &&
            clause.operator === operator &&
            clause.value1 === value1 &&
            clause.combineMethod === combineMethod
        );

        if (
          !clauseExists &&
          column !== "" &&
          operator !== "" &&
          value1 !== "" &&
          combineMethod !== undefined &&
          combineMethod !== null
        ) {
          updatedClauses.push({
            column: column,
            operator: operator,
            value1: value1,
            value2: null,
            combineMethod: combineMethod,
          });
        }

        let updatedOrder = prevData[currentField].data.order.map(
          (orderItem) => {
            if (orderItem.column === column) {
              return {
                ...orderItem,
                direction: direction,
              };
            }
            return orderItem;
          }
        );

        if (direction !== "") {
          const orderExists = updatedOrder.some(
            (orderItem) => orderItem.column === column
          );

          if (!orderExists && column !== "" && direction !== "") {
            updatedOrder = [
              ...updatedOrder,
              {
                column: column,
                direction: direction,
              },
            ];
          }
        }

        const newState = {
          ...prevData,
          [currentField]: {
            ...prevData[currentField],
            data: {
              ...prevData[currentField].data,
              clauses: updatedClauses,
              order: updatedOrder,
            },
          },
        };

        resolve(newState);
        return newState;
      });
    });
  };

  const handleTestClick = async () => {
    setTotalRecordsCount(null);
    let payload;

    if (id === 0) {
      const updatedViewData = await updateViewData();
      payload = generatePayload(updatedViewData);
    } else {
      payload = {
        id: id,
        viewId: viewId,
        name: viewData[currentField].name,
        description: viewData[currentField].description,
        filterOwnerName: null,
        convertedFromLegacyId: null,
        data: {
          display: Array.from(selectedItems),
          clauses: viewData[currentField].data.clauses,
          order: viewData[currentField].data.order,
        },
      };
    }

    try {
      setLoading(true);
      const response = await Testfilter(viewId, payload);
      if (response && Array.isArray(response.items)) {
        const headers =
          response.items.length > 0 ? Object.keys(response.items[0]) : [];
        setTestTableHeaders(headers);
        setTestTableData(response.items);

        if (response.items.length > 50) {
          const count = response.items[50]?.totalRecordsCount;
          setTotalRecordsCount(count);
        }
        else if (response.items.length <= 50) {
          setTotalRecordsCount(response.items.length);
        }
        else {
          setTotalRecordsCount(null);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    setIsChanged(true);
  };

  const validateInputs = () => {
    const newErrors = {
      name:
        viewData[currentField].name.trim().length < 3
          ? "Filter Name must be at least 3 characters."
          : "",
      description:
        viewData[currentField].description.trim().length < 3
          ? "Description must be at least 3 characters."
          : "",
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleSaveClick = async () => {
    if (loading) return;

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const updatedViewData = await updateViewData();
      const payload = generatePayload(updatedViewData);

      const response = await SaveFilter(viewId, id, payload);
      if (response === 201) {
        setShowSuccess(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlesummaryClick = async () => {
    setTotalRecordsCount(null);
    let payload;

    if (id === 0) {
      const updatedViewData = await updateViewData();
      payload = generatePayload(updatedViewData);
    } else {
      payload = {
        id: id,
        viewId: viewId,
        name: viewData[currentField].name,
        description: viewData[currentField].description,
        filterOwnerName: null,
        convertedFromLegacyId: null,
        data: {
          display: Array.from(selectedItems),
          clauses: viewData[currentField].data.clauses,
          order: viewData[currentField].data.order,
        },
      };
    }

    try {
      setLoading(true);
      const response = await Summary(viewId, payload);
      if (response && Array.isArray(response.items)) {
        const headers =
          response.items.length > 0 ? Object.keys(response.items[0]) : [];
        setSummaryTableHeaders(headers);
        setSummaryTableData(response.items);

        if (response.items.length > 50) {
          const count = response.items[50]?.totalRecordsCount;
          setTotalRecordsCount(count);
        } else if (response.items.length > 0 && response.items.length <= 50) {
          setTotalRecordsCount(response.items.length);
        } else {
          setTotalRecordsCount(null);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <SpinnerTest />
      </div>
    );
  }
  return (
    <div>
      <div className=" p-3" style={{ backgroundColor: theadcolor }}>
        {header.map((item, index) => (
          <h1 key={index} className={`text-gray-600 font-bold ${isDarkMode ? 'text-white' : ''}`}>
            Home/Queries/{toPascalCaseWithSpaces(item.description)}/
            {toPascalCaseWithSpaces(viewData[currentField].name)}
          </h1>
        ))}
      </div>

      <div className="flex justify-around p-0">
        <button
          className={`flex-1 m-0 font-bold text-lg p-1 ${!isSummaryReport
              ? "bg-[#CECECE] text-gray-600"
              : `bg-light-gray text-gray-600 ${isDarkMode ? 'text-white' : ''}`
            }`}
          onClick={handleFilterReport}
        >
          Filter Report
        </button>

        <button
          className={`flex-1 m-0 font-bold text-lg p-1 ${isSummaryReport
              ? "bg-[#CECECE] text-gray-600"
              : `bg-light-gray text-gray-600 ${isDarkMode ? 'text-white' : ''}`
            }`}
          onClick={handleSummaryReport}
        >
          Summary Report
        </button>
      </div>

      <div className="border rounded-lg shadow-lg mt-4 mr-1 ml-1 p-3">
        <div>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <div className="flex flex-col flex-1">
              <label className={`font-medium text-gray-600 font-roboto mb-1 ${isDarkMode ? 'text-white' : ''}`}>
                Filter Name<span className="text-gray-600">*</span>:
              </label>
              <input
                type="text"
                value={viewData[currentField].name}
                onChange={(e) => {
                  if (!isSummaryReport) {
                    setViewData((prevState) => ({
                      ...prevState,
                      [currentField]: {
                        ...prevState[currentField],
                        name: e.target.value,
                      },
                    }));
                    setIsChanged(true);
                  }
                }}
                className={`border p-0.5 rounded w-full ${errors.name ? "border-red-500" : ""
                  }`}
                placeholder="Filter Name*"
                required
                disabled={isSummaryReport}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <label className={`font-medium text-gray-600 font-roboto mb-1 ${isDarkMode ? 'text-white' : ''}`}>
                Description<span className="text-gray-600">*</span>:
              </label>
              <input
                type="text"
                value={viewData[currentField].description}
                onChange={(e) => {
                  if (!isSummaryReport) {
                    setViewData((prevState) => ({
                      ...prevState,
                      [currentField]: {
                        ...prevState[currentField],
                        description: e.target.value,
                      },
                    }));
                    setIsChanged(true);
                  }
                }}
                className={`border p-0.5 rounded w-full ${errors.description ? "border-red-500" : ""
                  }`}
                placeholder="Description*"
                required
                disabled={isSummaryReport}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center mt-8 space-x-2">

              <button
                className="text-[#848482] p-1 text-xl rounded flex items-center "
                onClick={handleCancelClick}
              >
                <Tooltip tooltipText="Cancel">
                  <CancelIcon className="w-5 h-5" />
                </Tooltip>
              </button>
          
              <button
                className="text-[#b9cbba] p-1 text-xl rounded flex items-center"
                onClick={handleSaveClick}
              >
                <Tooltip tooltipText="Save">
                  <SaveIcon />
                </Tooltip>
              </button>
            </div>
          </div>

          {showCancel && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"style={{zIndex:100}}>
              <div className="relative bg-white p-8 rounded shadow-lg"style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Confirm Cancel</h2>
              <h3 className={`font-roboto text-lg font-lite leading-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
              Are you sure you want to discard the changes.
              </h3>
                <div className="absolute bottom-4 right-4 flex space-x-4">
                <button
                    onClick={handleNoClick}
                    className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`}
                  >
                    <Tooltip tooltipText="No">
                  <CancelIcon />
                   </Tooltip>
                  </button>
                  
                  <button
                    onClick={handleOkayClick}
                    className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`}
                  >
                <Tooltip tooltipText="Discard">
                  <FontAwesomeIcon icon={faCheck} className={`w-5 h-5 text-[#99b99b] ${isDarkMode ? 'text-white' : ''}`} />
                </Tooltip>
                  </button>

                  
                </div>
              </div>
            </div>
          )}


          

          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"style={{zIndex:100}}>
              <div className="relative bg-white p-8 rounded shadow-lg"style={{ backgroundColor: theadcolor,width:"34.375rem", maxWidth: "100%", boxSizing: 'border-box',minHeight: "12.5rem", maxHeight: "100%" }}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Success Message</h2>
              <h3 className={`font-roboto text-lg font-lite leading-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
              Your filter has been successfully saved.
              </h3>
                
                <div className="absolute bottom-4 right-4 flex space-x-4">
                <button
                  onClick={() => setShowSuccess(false)}
                  className={`px-4 py-2 bg-transparent ${isDarkMode ? 'text-white' : ''}`}
                >
                  <Tooltip tooltipText="Ok">
                  <OkIcon color="#89c78d"/>
                </Tooltip>
                </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isSummaryReport && (
          <div className={`flex items-center mt-4 ml-2 ${isDarkMode ? 'text-white' : ''}`}>
           <label className="flex items-center mr-4">
  <Tooltip tooltipText="Private">
    <PrivateIcon
      isActive={viewData[currentField].privateFilter}
      className="h-6 cursor-pointer"
      onClick={() =>
        setViewData((prevState) => ({
          ...prevState,
          [currentField]: {
            ...prevState[currentField],
            privateFilter: !prevState[currentField].privateFilter,
          },
        }))
      }
    />
  </Tooltip>
</label>
<label className="flex items-center">
  <Tooltip tooltipText="Favorite">
    <FavouriteIcon
      isActive={viewData[currentField].favorite}
      className="cursor-pointer"
      onClick={() =>
        setViewData((prevState) => ({
          ...prevState,
          [currentField]: {
            ...prevState[currentField],
            favorite: !prevState[currentField].favorite,
          },
        }))
      }
    />
  </Tooltip>
</label>

          </div>
        )}

        <div className="mt-6">
          <h2 className={`font-roboto font-medium text-gray-600 mb-2 ml-2 ${isDarkMode ? 'text-white' : ''}`}>
            Query Conditions
          </h2>
          {rows[currentField].map((_, index) => (
            <div className="flex mb-2 items-center" key={index}>
              {index !== 0 && showOptions && (
                <select
                  name={`combineMethod-${index}`}
                  className="border p-1 rounded  w-20 mr-2 ml-1"
                  value={
                    viewData[currentField].data.clauses[index]?.combineMethod ||
                    ""
                  }
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}
              <select
                name={`column-${index}`}
                className="border p-1 rounded flex-grow mr-2 ml-1"
                value={viewData[currentField].data.clauses[index]?.column || ""}
                onChange={handleChange}
              >
                <option value="">Select Column</option>
                {viewData[currentField].columns.map((item, idx) => (
                  <option key={idx} value={item.columnName}>
                    {item.columnName}
                  </option>
                ))}
              </select>
              <select
                name={`operator-${index}`}
                className="border p-1 rounded w-1/3 mr-2"
                value={
                  viewData[currentField].data.clauses[index]?.operator || ""
                }
                onChange={handleChange}
              >
                <option value="">Select Operator</option>
                {operatorsList[index]?.map((operator, idx) => (
                  <option key={idx} value={operator.id}>
                    {operator.name}
                  </option>
                ))}
              </select>
              <input
                name={`value1-${index}`}
                type={
                  viewData[currentField].columns.find(
                    (col) =>
                      col.columnName ===
                      viewData[currentField].data.clauses[index]?.column
                  )?.dataType === "NUMBER"
                    ? "number"
                    : viewData[currentField].columns.find(
                      (col) =>
                        col.columnName ===
                        viewData[currentField].data.clauses[index]?.column
                    )?.dataType === "DATE"
                      ? "date"
                      : "text"
                }
                className="border p-0.5 rounded w-1/3 mr-2"
                placeholder={(() => {
                  const operator =
                    viewData[currentField].data.clauses[index]?.operator;
                  switch (operator) {
                    case "IS":
                    case "IS_NOT":
                      return "Enter a single value";
                    case "LT":
                    case "LTE":
                    case "GT":
                    case "GTE":
                      return "Enter a single numerical value";
                    case "BETWEEN":
                      return "Enter a single numerical value";
                    case "IS_IN":
                      return "Enter multiple values separated by comma";
                    case "CONTAINS":
                    case "NOT_CONTAINS":
                    case "STARTS_WITH":
                    case "ENDS_WITH":
                      return "Enter a single value";
                    default:
                      return "Value";
                  }
                })()}
                value={viewData[currentField].data.clauses[index]?.value1 || ""}
                onChange={handleChange}
                disabled={(() => {
                  const operator =
                    viewData[currentField].data.clauses[index]?.operator;
                  return (
                    operator === "IS_PROVIDED" || operator === "IS_NOT_PROVIDED"
                  );
                })()}
              />
              {viewData[currentField].data.clauses[index]?.operator ===
                "BETWEEN" && (
                  <div className="flex items-center">
                    <span>&</span>
                    <input
                      name={`value2-${index}`}
                      type={
                        viewData[currentField].columns.find(
                          (col) =>
                            col.columnName ===
                            viewData[currentField].data.clauses[index]?.column
                        )?.dataType === "NUMBER"
                          ? "number"
                          : viewData[currentField].columns.find(
                            (col) =>
                              col.columnName ===
                              viewData[currentField].data.clauses[index]?.column
                          )?.dataType === "DATE"
                            ? "date"
                            : "text"
                      }
                      className="border p-0.5 rounded w-72 mr-2 ml-2"
                      placeholder="Enter a single numerical value"
                      value={
                        viewData[currentField].data.clauses[index]?.value2 || ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                )}

              <button
                className="p-2 text-[#cd9898] mr-2 h-8 w-8 items-center flex justify-center text-sm"
                onClick={() => removeRow(index)}
              >
                <Tooltip tooltipText="Remove">
                  <MinusIcon />
                </Tooltip>
              </button>
              <button
                className=" p-2 text-[#b9cbba] h-8 w-8 items-center flex justify-center text-sm"
                onClick={addRow}
              >
                <Tooltip tooltipText="Add">
                  <PlusIcon />
                </Tooltip>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 mb-4">
          <h2 className={`font-roboto font-medium text-gray-600 mb-2 ml-2 ${isDarkMode ? 'text-white' : ''}`}>
            Sort Order
          </h2>
          {sortRows[currentField].map((_, index) => (
            <div key={index} className="flex items-center mb-2">
              <select
                name={`orderColumn-${index}`}
                className="border p-1 w-[335px] rounded  mr-2 ml-1"
                value={viewData[currentField].data.order[index]?.column || ""}
                onChange={handleChange}
              >
                <option value="">Select Column</option>
                {viewData[currentField].data.display.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                name={`orderSort-${index}`}
                className="border p-1 rounded w-56 mr-2"
                value={
                  viewData[currentField].data.order[index]?.direction || ""
                }
                onChange={handleChange}
              >
                <option value="">Select Direction</option>
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>

              <button
                className="text-[#cd9898] mr-2 h-6 w-6 items-center flex justify-centertext-sm"
                onClick={() => removeSortRow(index)}

              >
                <Tooltip tooltipText="Remove">
                  <MinusIcon />
                </Tooltip>
              </button>
              <button
                className="text-[#b9cbba] h-6 w-6 items-center flex justify-center text-sm"
                onClick={addSortRow}
                title="Add Row"
              >
                <Tooltip tooltipText="Add">
                  <PlusIcon />
                </Tooltip>
              </button>
            </div>
          ))}
        </div>

        {!isSummaryReport && (
          <div className="mb-4 ml-2">
            <button
              onClick={handleToggleFields}
              className={`p-2 rounded mr-2 ${showAdditionalBox
                  ? "bg-neutral-400 text-gray-600 font-medium"
                  : "bg-stone-200 text-gray-600 font-medium"
                }`}
            >
              Toggle Fields
            </button>
            <button
              onClick={handleTestTable}
              className={`p-2 rounded ${showTestTable
                  ? "bg-neutral-400 text-gray-600 font-medium"
                  : "bg-stone-200 text-gray-600 font-medium"
                }`}
            >
              Test
            </button>
          </div>
        )}

        {isSummaryReport && (
          <div className="mb-4 ml-2">
            <button
              onClick={handleToggleFields}
              className={`p-2 rounded mr-2 ${showAdditionalBox
                  ? "bg-neutral-400 text-gray-600 font-medium"
                  : "bg-stone-200 text-gray-600 font-medium"
                }`}
            >
              Select Fields
            </button>
            <button
              onClick={handleTestTable}
              className={`p-2 rounded ${showTestTable
                  ? "bg-neutral-400 text-gray-600 font-medium"
                  : "bg-stone-200 text-gray-600 font-medium"
                }`}
            >
              Summary
            </button>
          </div>
        )}

        {showAdditionalBox && (
          <div className="border p-2 rounded mt-4 h-72 w-auto ml-1 mr-2 overflow-y-auto">
            <h1 className={`mt-2 mb-2 ${isDarkMode ? 'text-white' : ''}`}>
              {isSummaryReport
                ? "Click an item to enable it"
                : "Click an item to disable it"}
            </h1>
            <ul>
              {viewData[currentField].columns.map((item, index) => (
                <li key={index} className={`flex items-center mb-2 ${isDarkMode ? 'text-white' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.columnName)}
                    onChange={() => handleCheckboxChange(item.columnName)}
                    className="mr-2"
                  />
                  <Link href="#">{item.columnName}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showTestTable && !isSummaryReport && (
          <div className={`border p-2 rounded mt-0 h-auto ml-4 mr-6 ${isDarkMode ? 'text-white' : ''}`}>
            <div className="flex items-center space-x-4">
              <button
                className="w-[60px] h-8 border flex items-center rounded-sm p-1 bg-grey-600 font-medium"
                onClick={handleTestClick}
              >
                <FontAwesomeIcon icon={faFlask} />
                Test
              </button>
              {totalRecordsCount !== null && (
                <div className="text-gray-600">
                  {totalRecordsCount > 50 ? (
                    `Showing 50 of ${totalRecordsCount} Records`
                  ) : (
                    `Total Records Count: ${totalRecordsCount}`
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <div className="overflow-x-auto h-80 mt-3">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-200 z-10">
                  <tr>
                    {viewData[currentField].columns
                      .filter((column) =>
                        selectedItems.has(column.columnName)
                      )
                      .map((column, index) => (
                        <th key={index} className="border p-2 bg-gray-200">
                          {column.columnName}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {testTableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {viewData[currentField].columns
                        .filter((column) =>
                          selectedItems.has(column.columnName)
                        )
                        .map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className="border p-2 text-center"
                          >
                            {row[column.columnName.toLowerCase()]}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {isSummaryReport && showTestTable && (
          <div className="border p-2 rounded mt-0 h-auto ml-4 mr-6">
            <div className="flex items-center space-x-4">
              <button
                className="w-[95px] h-8 border flex rounded-sm p-1 items-center bg-grey-600 font-medium"
                onClick={handlesummaryClick}
              >
                <FontAwesomeIcon icon={faFlask} />
                Summary
              </button>
              {totalRecordsCount !== null && (
                <div className="text-gray-600">
                  {totalRecordsCount > 50 ? (
                    `Showing 50 of ${totalRecordsCount} Records`
                  ) : (
                    `Total Records Count: ${totalRecordsCount}`
                  )}
                </div>
              )}
            </div>
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <div className="overflow-x-auto h-80 mt-3">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-200 z-10 w-full ">
                    <tr>
                      {viewData[currentField].columns
                        .filter((column) =>
                          selectedItems.has(column.columnName)
                        )
                        .map((column, index) => (
                          <th key={index} className="border p-2 bg-gray-200">
                            {column.columnName}
                          </th>
                        ))}
                        <th className="border p-2 bg-gray-200">COUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryTableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {viewData[currentField].columns
                          .filter((column) =>
                            selectedItems.has(column.columnName)
                          )
                          .map((column, colIndex) => (
                            <td
                              key={colIndex}
                              className="border p-2 text-center"
                            >
                              {row[column.columnName.toLowerCase()]}
                            </td>
                          ))}
                            <td className="border p-2 text-center">
            {row.COUNT} {/* Adjust if `count` is located differently in your data */}
          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
