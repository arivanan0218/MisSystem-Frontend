import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import axios from "../../axiosConfig"; // Import axios for HTTP requests
import UploadMarks from "../../Components/UploadMarks"; // Import UploadMarks component

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignmentDetails, setAssignmentDetails] = useState({});
  const [formOpen, setFormOpen] = useState(false); // State to control form visibility
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null); // Store student data for student users
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentEditMark, setCurrentEditMark] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Default row size is 10

  // LocalStorage data
  const token = localStorage.getItem("auth-token");
  const departmentId = localStorage.getItem("departmentId");
  const intakeId = localStorage.getItem("intakeId");
  const semesterId = localStorage.getItem("semesterId");
  const moduleId = localStorage.getItem("moduleId");
  const assignmentId = localStorage.getItem("assignmentId");
  const userRole = localStorage.getItem("userRole");

  // Open and close the form
  const openForm = () => setFormOpen(true);
  const closeForm = () => {
    setFormOpen(false);
    setEditMode(false);
    setCurrentEditMark(null);
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/student/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }
      
      // Ensure each student has a proper registration number
      const enhancedStudents = response.data.map(student => ({
        ...student,
        regNo: student.regNo || student.student_Reg_No || student.studentRegNo || 
               (student.id ? student.id.toString() : 'No Register No')
      }));
      
      console.log('Enhanced students with registration numbers:', enhancedStudents);
      setStudents(enhancedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Could not fetch students. Please try again later.");
    }
  };

  // Fetch assignment details
  const fetchAssignmentDetails = async () => {
    try {
      if (!assignmentId) {
        console.warn("Assignment ID is missing from localStorage. Using default assignment details.");
        setAssignmentDetails({
          assignmentName: "Select an assignment",
          assignmentPercentage: "N/A",
          assignmentDuration: "N/A"
        });
        return;
      }

      console.log(`Fetching details for assignment ID: ${assignmentId}`);
      const response = await axios.get(`/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log(`Assignment details for ID ${assignmentId}:`, response.data);
        setAssignmentDetails(response.data || {});
      } else {
        throw new Error(`Failed to fetch assignment details: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      setError("Could not fetch assignment details. Please try again later.");
    }
  };

  // Fetch marks for the current assignment
  const fetchMarks = async () => {
    try {
      setLoading(true);
      
      // If no assignment is selected, use the general endpoint
      if (!assignmentId) {
        console.log("No assignment ID selected. Fetching all marks.");
        const response = await axios.get("/marks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch marks: ${response.statusText}`);
        }

        console.log("All marks data received:", response.data);
        setMarks(response.data || []);
        setLoading(false);
        return;
      }
      
      // For students, we need to get their specific marks
      if (userRole === "ROLE_STUDENT") {
        const studentId = localStorage.getItem("userId"); // Assuming userId is stored for students
        
        if (!studentId) {
          console.error("No student ID found in localStorage");
          setLoading(false);
          return;
        }
        
        console.log(`Fetching marks for student ID ${studentId}`);
        const response = await axios.get(`/marks/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.status === 200) {
          console.log('Student marks data:', response.data);
          setStudentData(response.data);
          
          if (response.data.assignmentMarks && response.data.assignmentMarks.length > 0) {
            // Transform the student marks data to match the expected format for the UI
            // Then filter for current assignment
            const transformedMarks = response.data.assignmentMarks
              .filter(mark => mark.assignmentId == assignmentId)
              .map(mark => ({
                id: mark.assignmentId,
                student_Reg_No: response.data.regNo || response.data.student_Reg_No || 
                              response.data.studentRegNo || response.data.studentId.toString(),
                student_name: response.data.student_name || response.data.studentName || 'Unnamed Student',
                marksObtained: mark.marksObtained,
                assignmentName: mark.assignmentName,
                assignmentId: mark.assignmentId,
                studentId: response.data.studentId
              }));
            
            console.log('Transformed and filtered student marks:', transformedMarks);
            setMarks(transformedMarks);
          } else {
            // If no assignment marks, set to empty array
            setMarks([]);
          }
        }
      } else {
        // For admin/lecturers, use the new assignment-specific endpoint
        console.log(`Fetching marks for assignment ID: ${assignmentId}`);
        
        const response = await axios.get(`/marks/assignment/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.status !== 200) {
          throw new Error(`Failed to fetch assignment marks: ${response.statusText}`);
        }
        
        console.log(`Marks for assignment ID ${assignmentId}:`, response.data);
        setMarks(response.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching marks:", error);
      setError("Could not fetch marks. Please try again later.");
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Filter marks based on search term
  const filteredMarks = marks.filter(mark => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = (mark.student_name || "").toLowerCase();
    const regNo = (mark.student_Reg_No || "").toString().toLowerCase();
    
    return studentName.includes(searchLower) || regNo.includes(searchLower);
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMarks = filteredMarks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMarks.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle mark editing
  const handleEditMark = (mark) => {
    console.log("Editing mark:", mark);
    
    // If assignment ID is missing in the mark, add it from localStorage
    if (!mark.assignmentId && assignmentId) {
      mark.assignmentId = parseInt(assignmentId);
    }
    
    setCurrentEditMark(mark);
    setEditMode(true);
    openForm();
  };

  // Handle mark deletion
  const handleDeleteMark = async (markId) => {
    if (window.confirm("Are you sure you want to delete this mark?")) {
      try {
        const response = await axios.delete(`/marks/${markId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refresh the marks data after deletion
        fetchMarks();
        // Show success message
        alert("Mark deleted successfully");
      } catch (error) {
        console.error("Error deleting mark:", error);
        // Show more specific error message from the backend if available
        if (error.response && error.response.data) {
          setError(`Failed to delete mark: ${error.response.data}`);
        } else {
          setError("Failed to delete mark. Please try again.");
        }
      }
    }
  };

  // Reset to first page when assignment or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [assignmentId, searchTerm]);

  // Fetch data when component mounts or when assignment/module changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchStudents();
        await fetchAssignmentDetails();
        await fetchMarks();
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [assignmentId, moduleId]);

  return (
    <div>
      <Header />
      <Breadcrumb
        breadcrumb={[
          { label: "Home", link: "/departments" },
          { label: "Degree Programs", link: `/departments` },
          { label: "Intakes", link: `/departments/${departmentId}/intakes` },
          {
            label: "Semesters",
            link: `/departments/${departmentId}/intakes/${intakeId}/semesters`,
          },
          {
            label: "Modules",
            link: `/departments/${departmentId}/intakes/semesters/modules`,
          },
          {
            label: "Module Assessments",
            link: `/departments/${moduleId}/intakes/semesters/modules/assignments`,
          },
          {
            label: "Assessments Marks",
            link: `/departments/${moduleId}/intakes/semesters/modules/assignments/marks`,
          },
        ]}
      />
      <div className="flex-grow px-4 sm:px-6 lg:px-20 font-poppins justify-center md:mr-[20%] md:ml-[10%]">
        {/* Search and Add Marks */}
        <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search by student name or registration number"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {(userRole === "ROLE_AR" || userRole === "ROLE_HOD" || userRole === "ROLE_MODULE_COORDINATOR" || userRole === "ROLE_LECTURER") && (
            <button
              onClick={() => {
                setEditMode(false);
                setCurrentEditMark(null);
                openForm();
              }}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
              aria-label="Add Marks"
            >
              + Marks
            </button>
          )}
        </div>

        {/* Assignment Details Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Assignment Details</h2>
          <p>
            <strong>Assignment Name:</strong> {assignmentDetails.assignmentName || "N/A"}
          </p>
          <p>
            <strong>Percentage:</strong> {assignmentDetails.assignmentPercentage || "N/A"}
          </p>
          <p>
            <strong>Duration:</strong> {assignmentDetails.assignmentDuration || "N/A"}
          </p>
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3" 
              onClick={() => setError(null)}
            >
              <span className="text-red-500">×</span>
            </button>
          </div>
        )}

        {/* Marks Table */}
        <div className="mt-[30px]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading marks data...</p>
            </div>
          ) : currentMarks.length > 0 ? (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full table-auto text-sm text-left text-gray-500">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-700">Register No</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Student Name</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Obtained Marks</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentMarks.map((mark) => (
                    <tr key={mark.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{mark.student_Reg_No || "No Register No"}</td>
                      <td className="px-6 py-4">{mark.student_name || "Unnamed Student"}</td>
                      <td className="px-6 py-4">{mark.marksObtained || "No Marks"}</td>
                      <td className="px-6 py-4">
                        {(userRole === "ROLE_AR" || userRole === "ROLE_HOD" || userRole === "ROLE_MODULE_COORDINATOR" || userRole === "ROLE_LECTURER") ? (
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleEditMark(mark)}
                              className="text-blue-800 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMark(mark.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-400">No actions available</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Add empty rows if currentMarks has fewer than itemsPerPage rows */}
                  {currentMarks.length < itemsPerPage && 
                    Array.from({ length: itemsPerPage - currentMarks.length }).map((_, idx) => (
                      <tr key={`empty-row-${idx}`} className="bg-gray-100">
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">-</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Marks Available</h3>
                <p className="text-gray-600 mb-4 text-center max-w-md">
                  {userRole === "ROLE_STUDENT" ? 
                    "You don't have any marks recorded for this assignment yet. Your lecturer will upload marks after grading your assignment." :
                    searchTerm ? 
                      "No marks match your search criteria. Try a different search term." :
                      "There are no marks recorded for this assignment yet. Use the 'Add Marks' button to upload marks for students."}
                </p>
                {userRole !== "ROLE_STUDENT" && !searchTerm && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setCurrentEditMark(null);
                      openForm();
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Marks
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-blue-950 hover:bg-gray-300"
              }`}
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              // Show limited pagination numbers with ellipsis for many pages
              if (
                totalPages <= 7 ||
                index === 0 ||
                index === totalPages - 1 ||
                (index >= currentPage - 2 && index <= currentPage + 1)
              ) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-950 text-white"
                        : "bg-gray-200 text-blue-950 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (
                index === currentPage - 3 ||
                index === currentPage + 2
              ) {
                return <span key={`ellipsis-${index}`}>...</span>;
              }
              return null;
            })}
            <button 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-blue-950 hover:bg-gray-300"
              }`}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>

      {/* Popup for Add/Edit Marks */}
      {formOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">
              {editMode ? "Edit Marks" : "Upload Marks"}
            </h1>
            <UploadMarks 
              closeForm={closeForm} 
              onUploadSuccess={fetchMarks} 
              editMode={editMode}
              markToEdit={currentEditMark}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Marks;