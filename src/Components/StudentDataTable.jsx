import { useState, useEffect } from "react";
import axios from "../axiosConfig";
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
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      (selectedDepartment === "" || item.department === selectedDepartment) &&
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, selectedDepartment, globalFilter]);

  useEffect(() => {
    const uniqueDepartments = Array.from(
      new Set(data.map((item) => item.department))
    );
    setDepartments(uniqueDepartments);
  }, [data]);

  const handleDelete = async (rowData) => {
    try {
      const response = await axios.delete(`/student/${rowData.id}`);
      console.log("Delete response:", response.data);
      setFilteredData((prev) => prev.filter((item) => item.id !== rowData.id));
      alert("Student deleted successfully");
      if (onDelete) onDelete(rowData.id);
    } catch (error) {
      console.error("Error deleting student:", error);
      if (error.response) {
        alert(
          `Failed to delete the student: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        alert("Failed to delete the student. Please try again.");
      }
    }
  };

  const columns = [
    { accessorKey: "departmentId", header: "Department ID" },
    { accessorKey: "intakeId", header: "Intake ID" },
    { accessorKey: "studentRegNo", header: "Registration No." },
    {
      id: "fullName",
      header: "Full Name",
      accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
    },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "studentNIC", header: "NIC" },
    { accessorKey: "studentMail", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "dateOfBirth", header: "Date of Birth" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original)}>
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
            {departments.map((dept) => (
              <DropdownMenuItem key={dept} onClick={() => setSelectedDepartment(dept)}>
                {dept}
              </DropdownMenuItem>
            ))}
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
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
