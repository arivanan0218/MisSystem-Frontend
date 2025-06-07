import { useState, useEffect, useRef } from "react";
import axios from "../../../axiosConfig";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMediaQuery } from "@uidotdev/usehooks";

const DataTable = ({ data = [], onRowClick = () => {}, onDelete = () => {}, onEdit = () => {} }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const isMobile = useMediaQuery("(max-width: 596px)");
  const isLargeScreen = useMediaQuery("(max-width: 1143px)");

  const containerRef = useRef(null);

  const handleDelete = async (rowData) => {
    const token = localStorage.getItem("auth-token");
    try {
      await axios.delete(`/lecturer/${rowData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredData(prevData => prevData.filter(item => item.id !== rowData.id));
      onDelete(rowData);
    } catch (error) {
      console.error("Error deleting lecturer:", error.response?.data || error.message);
      alert("Failed to delete the lecturer.");
    }
  };

  useEffect(() => {
    if (!Array.isArray(data)) return setFilteredData([]);
    const filtered = data.filter((item) =>
      (selectedDepartment === "" || item.department === selectedDepartment) &&
      Object.values(item).some((val) =>
        val !== null && String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, selectedDepartment, globalFilter]);

  const generateColumns = () => {
    if (filteredData.length === 0) return [];
    const firstItem = filteredData[0];
    const keys = Object.keys(firstItem).filter(
      (key) =>
        !["id", "departmentId", "password"].includes(key)
    );

    // Map technical keys to user-friendly headers
    const headerMap = {
      lecturerName: "Name",
      lecturerPhoneNumber: "Phone Number",
      lecturerEmail: "Email",
      username: "User Name",
    };

    return keys
      .filter((key) => {
      if (isLargeScreen && ["lecturerEmail"].includes(key)) return false;
      if (isMobile && ["lecturerEmail", "username"].includes(key)) return false;
      return true;
      })
      .map((key) => ({
      accessorKey: key,
      header: headerMap[key] || key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      }));
  };

  //actions column
  const columns = [
    ...generateColumns(),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-col md:flex-row gap-2 whitespace-nowrap">
          <button
            className="px-3 py-1 border rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded"
        />

        <div className="relative">
          <button
            className="px-4 py-2 border rounded"
            onClick={() =>
              document.getElementById("departmentDropdown").classList.toggle("hidden")
            }
          >
            Filter by Department
          </button>
          <div
            id="departmentDropdown"
            className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden z-10"
          >
            <div className="py-1">
              <button onClick={() => setSelectedDepartment("")} className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                All
              </button>
              <button onClick={() => setSelectedDepartment("CS")} className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                CS
              </button>
              <button onClick={() => setSelectedDepartment("Math")} className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                Math
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div ref={containerRef} className="overflow-x-auto border rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {table.getFlatHeaders().map((header) => (
                <th key={header.id} className="p-3 border text-left whitespace-nowrap">
                  {header.column.columnDef.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`p-3 border align-top ${
                      cell.column.id === "actions"
                        ? "whitespace-nowrap"
                        : "break-words max-w-[200px]"
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4 flex-wrap gap-2 items-center">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
