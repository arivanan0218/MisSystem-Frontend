import { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const DataTable = ({ data = [], onRowClick = () => {}, onDelete = () => {}, onEdit = () => {} }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleDelete = async (rowData) => {
    const token = localStorage.getItem("auth-token"); // Retrieve stored token
  
    try {
      const response = await axios.delete(`/lecturer/${rowData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log(response.data);
      setFilteredData(prevData => prevData.filter(item => item.id !== rowData.id));
      onDelete(rowData);
    } catch (error) {
      console.error("Error deleting lecturer:", error.response?.data || error.message);
      alert("Failed to delete the lecturer.");
    }
  };
  
  useEffect(() => {
    console.log('DataTable received data:', data);
    if (!Array.isArray(data)) {
      console.error('DataTable expected array but received:', typeof data);
      setFilteredData([]);
      return;
    }
    
    try {
      const filtered = data.filter((item) =>
        (selectedDepartment === "" || item.department === selectedDepartment) &&
        Object.values(item).some((val) =>
          val !== null && String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
      console.log('Filtered data:', filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error filtering data:', error);
      setFilteredData([]);
    }
  }, [data, selectedDepartment, globalFilter]);

  // Dynamically generate columns based on the first data item
  const generateColumns = () => {
    if (filteredData.length === 0) {
      return [
        { accessorKey: "lecturerName", header: "Name" },
        { accessorKey: "lecturerEmail", header: "Email" },
        { accessorKey: "lecturerPhoneNumber", header: "Phone Number" },
      ];
    }
    
    // Get all keys from the first item except 'id'
    const firstItem = filteredData[0];
    const keys = Object.keys(firstItem).filter(key => key !== 'id');
    
    return keys.map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    }));
  };
  
  const columns = [
    ...generateColumns(),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded mr-2 text-sm"
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
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-1/3 p-2 border rounded"
        />

        <div className="relative">
          <button 
            className="px-4 py-2 border rounded"
            onClick={() => document.getElementById('departmentDropdown').classList.toggle('hidden')}
          >
            Filter by Department
          </button>
          <div id="departmentDropdown" className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden z-10">
            <div className="py-1">
              <button onClick={() => setSelectedDepartment("")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">All</button>
              <button onClick={() => setSelectedDepartment("CS")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">CS</button>
              <button onClick={() => setSelectedDepartment("Math")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Math</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {table.getFlatHeaders().map((header) => (
                <th key={header.id} className="p-3 border">
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
                  <td key={cell.id} className="p-3 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`px-4 py-2 rounded ${!table.getCanPreviousPage() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`px-4 py-2 rounded ${!table.getCanNextPage() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;