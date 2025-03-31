import { useState, useEffect } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentDataTable = ({ data, onRowClick, onDelete, onEdit }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleDelete = async (rowData) => {
    const token = localStorage.getItem("jwtToken"); // Retrieve stored token

    try {
      const response = await axios.delete(`http://localhost:8081/api/student/${rowData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data);
      setFilteredData(prevData => prevData.filter(item => item.id !== rowData.id));
    } catch (error) {
      console.error("Error deleting student:", error.response?.data || error.message);
      alert("Failed to delete the student.");
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      (selectedDepartment === "" || item.department === selectedDepartment) &&
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, selectedDepartment, globalFilter]);

  const columns = [
    
    { accessorKey: "regNo", header: "Registration No." },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "nic", header: "NIC" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "username", header: "User Name" },
    { accessorKey: "password", header: "Password" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original)}
          >
            Delete
          </Button>
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
      {/* Search and Filter */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by Department</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedDepartment("")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDepartment("CS")}>
              CS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDepartment("Math")}>
              Math
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudentDataTable;
