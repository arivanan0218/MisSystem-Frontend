import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Breadcrumb from "../Components/Breadcrumb";
import Footer from "../Components/Footer";
import axios from "../axiosConfig"; // Import axios for HTTP requests
import UploadMarks from "../Components/UploadMarks"; // Import UploadMarks component

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignmentDetails, setAssignmentDetails] = useState({});
  const [formOpen, setFormOpen] = useState(false); // State to control form visibility
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null); // Store student data for student users

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
  const closeForm = () => setFormOpen(false);

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

  // Fetch marks from API
  const fetchMarks = async () => {
    try {
      // Make sure we have an assignment ID
      if (!assignmentId) {
        console.warn("No assignment ID found in localStorage. Marks will not be filtered by assignment.");
      } else {
        console.log(`Fetching marks for assignment ID: ${assignmentId}`);
      }
      
      // First, ensure we have students data
      if (students.length === 0) {
        await fetchStudents();
      }
      
      // Fetch all marks
      const response = await axios.get("/marks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch marks: ${response.statusText}`);
      }

      // Check if response.data is an array (for admin/lecturer) or an object (for students)
      if (Array.isArray(response.data)) {
        console.log('Admin/Lecturer marks data:', response.data);
        
        // Ensure each mark has the student registration number and filter by current assignment ID
        const enhancedMarks = response.data.map(mark => {
          // Find the corresponding student to get registration number
          const student = students.find(s => s.id === mark.studentId);
          
          // Get the actual registration number from the student object
          let regNo;
          if (student) {
            // If we found a matching student, use their registration number
            regNo = student.regNo || student.student_Reg_No || student.studentRegNo || 
                   (student.id ? student.id.toString() : null);
            console.log(`Found student for ID ${mark.studentId}:`, student);
            console.log(`Using registration number: ${regNo}`);
          } else {
            // If no matching student, try to get registration number from mark properties
            regNo = mark.student_Reg_No || mark.studentRegNo || mark.regNo || 
                   (mark.student && mark.student.regNo) || 
                   (mark.studentId ? mark.studentId.toString() : 'No Register No');
            console.log(`No student found for ID ${mark.studentId}, using regNo: ${regNo}`);
          }
          
          // Get student name from student if available, otherwise try mark properties
          const studentName = (student && (student.firstName ? 
                             `${student.firstName} ${student.lastName || ''}`.trim() : student.name)) || 
                             mark.student_name || mark.studentName || 
                             'Unnamed Student';
          
          return {
            ...mark,
            student_Reg_No: regNo,
            student_name: studentName
          };
        });
        
        console.log('Enhanced marks data with registration numbers:', enhancedMarks);
        
        // Filter marks by the current assignment ID if available
        if (assignmentId) {
          const filteredMarks = enhancedMarks.filter(mark => mark.assignmentId == assignmentId);
          console.log(`Filtered marks for assignment ID ${assignmentId}:`, filteredMarks);
          setMarks(filteredMarks);
        } else {
          setMarks(enhancedMarks);
        }
        setStudentData(null);
      } else if (response.data && typeof response.data === 'object') {
        // For students, we get a MarksResponseDTO
        console.log('Student marks data:', response.data);
        setStudentData(response.data);
        
        if (response.data.assignmentMarks && response.data.assignmentMarks.length > 0) {
          // Transform the student marks data to match the expected format for the UI
          const transformedMarks = response.data.assignmentMarks.map(mark => ({
            id: mark.assignmentId,
            student_Reg_No: response.data.regNo || response.data.student_Reg_No || response.data.studentRegNo || response.data.studentId.toString(),
            student_name: response.data.student_name || response.data.studentName || 'Unnamed Student',
            marksObtained: mark.marksObtained,
            assignmentName: mark.assignmentName,
            assignmentId: mark.assignmentId
          }));
          
          console.log('Transformed student marks:', transformedMarks);
          
          // Filter by current assignment ID if available
          if (assignmentId) {
            const filteredMarks = transformedMarks.filter(mark => mark.assignmentId == assignmentId);
            console.log(`Filtered student marks for assignment ID ${assignmentId}:`, filteredMarks);
            setMarks(filteredMarks);
          } else {
            setMarks(transformedMarks);
          }
          
          // If we have assignment marks, set the first one as the current assignment details
          const firstAssignment = response.data.assignmentMarks[0];
          setAssignmentDetails({
            assignmentName: firstAssignment.assignmentName,
            assignmentPercentage: firstAssignment.assignmentPercentage,
            assignmentDuration: 'N/A'
          });
        } else {
          // If no assignment marks, set to empty array
          setMarks([]);
        }
      } else {
        // If neither, set to empty array
        console.log('No marks data found');
        setMarks([]);
        setStudentData(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching marks:", error);
      setError("Could not fetch marks. Please try again later.");
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMarks = marks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(marks.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch data on component mount
  useEffect(() => {
    setLoading(true);
    fetchStudents();
    fetchAssignmentDetails();
    fetchMarks();
  }, [assignmentId, departmentId, intakeId, semesterId, moduleId, token]);

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[{ label: "Home", link: "/" }, { label: "Marks", link: "/marks" }]} />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        {/* Search and Add Marks */}
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {(userRole === "ROLE_AR" || userRole === "ROLE_HOD" || userRole === "ROLE_MODULE_COORDINATOR" || userRole === "ROLE_LECTURER") && (
            <button
              onClick={openForm}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
              aria-label="Add Marks"
            >
              Add Marks +
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

        {/* Marks Table */}
        <div className="mt-[30px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          
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
                  {currentMarks.map((mark) => {
                    // Find the corresponding student to get accurate registration number
                    const student = students.find(s => s.id === mark.studentId);
                    const regNo = student ? 
                      (student.regNo || student.student_Reg_No || student.studentRegNo) : 
                      (mark.student_Reg_No || mark.studentRegNo || mark.regNo || "No Register No");
                    
                    return (
                      <tr key={mark.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{regNo}</td>
                        <td className="px-6 py-4">{mark.student_name || mark.studentName || "Unnamed Student"}</td>
                        <td className="px-6 py-4">{mark.marksObtained || "No Marks"}</td>
                        <td className="px-6 py-4">
                          {(userRole === "ROLE_AR" || userRole === "ROLE_HOD" || userRole === "ROLE_MODULE_COORDINATOR" || userRole === "ROLE_LECTURER") ? (
                            <div className="flex space-x-4">
                              <button
                                onClick={() => localStorage.setItem("markId", mark.id)}
                                className="text-blue-800 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => alert("Delete functionality not implemented yet")}
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
                    );
                  })}
                  
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
                    "You don't have any marks recorded for this module yet. Your lecturer will upload marks after grading your assignments." :
                    "There are no marks recorded for this module yet. Use the 'Add Marks' button to upload marks for students."}
                </p>
                {userRole !== "ROLE_STUDENT" && (
                  <button
                    onClick={openForm}
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
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 text-blue-950"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popup for Add Marks */}
      {formOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Upload Marks</h1>
            <UploadMarks closeForm={closeForm} onUploadSuccess={fetchMarks} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Marks;
