import { useState, useEffect, useRef } from "react";
import axios from "../../../axiosConfig";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/Components/input";
import { Button } from "@/Components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/dropdown-menu";
import { useMediaQuery } from "@uidotdev/usehooks";

const StudentDataTable = ({ data, onRowClick, onDelete, onEdit }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [departments, setDepartments] = useState([]);
  
  // Responsive media queries (optional, can still use)
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1073px)");
  const isLargeScreen = useMediaQuery("(max-width: 1243px)");

  // Ref to scroll container
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Filter data when globalFilter or selectedDepartment changes
  useEffect(() => {
    const filtered = data.filter((item) =>
      (selectedDepartment === "" || item.department === selectedDepartment) &&
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, selectedDepartment, globalFilter]);

  // Get unique departments
  useEffect(() => {
    const uniqueDepartments = Array.from(
      new Set(data.map((item) => item.department))
    );
    setDepartments(uniqueDepartments);
  }, [data]);

  // Detect overflow of the table container
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [filteredData]);

  // Delete handler
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

  // Define columns with dynamic visibility based on overflow and screen size
  const columns = [
    { accessorKey: "studentRegNo", header: "Registration No." },
    {
      id: "fullName",
      header: "Full Name",
      accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
    },
     !isTablet && { accessorKey: "studentNIC", header: "NIC" },
     !isTablet && { accessorKey: "studentMail", header: "Email" },
     !isMobile && { accessorKey: "phoneNumber", header: "Phone Number" },
    !isLargeScreen && { accessorKey: "gender", header: "Gender" },
    !isLargeScreen &&  { accessorKey: "dateOfBirth", header: "Date of Birth" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-col lg:flex-row gap-2 lg:space-x-2 whitespace-nowrap">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ].filter(Boolean);

  // Create react-table instance
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
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-1/3"
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

      {/* Table */}
      <div 
        ref={containerRef}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {table.getFlatHeaders().map((header) => (
                <th key={header.id} className="p-3 border text-left">
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
