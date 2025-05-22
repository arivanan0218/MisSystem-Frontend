import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from "../../Components/Breadcrumb";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const ViewMarks = () => {
  const [moduleResults, setModuleResults] = useState([]);
  const [moduleDetails, setModuleDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState("");
  const navigate = useNavigate();

  const moduleId = localStorage.getItem("moduleId");
  // Get departmentId, intakeId, and semesterId from localStorage
      const departmentId = localStorage.getItem("departmentId") || 1;
      const intakeId = localStorage.getItem("intakeId") || 1;
      const semesterId = localStorage.getItem("semesterId") || 1;
  const token = localStorage.getItem("auth-token");

  // Function to fetch module results
  const fetchData = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      
      // Fetch module results
      const response = await axios.get(
        `http://localhost:8081/api/module-results/module?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.length > 0) {
        setModuleResults(response.data);
        
        // Extract module details from first result
        const firstResult = response.data[0];
        setModuleDetails({
          name: firstResult.moduleName,
          code: `MOD-${firstResult.moduleId}`,
          departmentName: firstResult.departmentName,
          semesterName: firstResult.semesterName,
          intakeName: firstResult.intakeName,
          credits: localStorage.getItem("moduleCredits") || 3
        });
      } else {
        setError("No module results found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
        localStorage.removeItem("auth-token");
        navigate("/login");
      } else {
        setError("Failed to fetch data. Please try again later.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleId, navigate]);

  // Function to calculate module marks
  const calculateMarks = async () => {
    setCalculating(true);
    setCalculationMessage("");
    
    try {
      // Get required IDs from localStorage
      const departmentId = localStorage.getItem("departmentId") || 
        (moduleResults.length > 0 ? moduleResults[0].departmentId : 1);
      const intakeId = localStorage.getItem("intakeId") || 
        (moduleResults.length > 0 ? moduleResults[0].intakeId : 1);
      const semesterId = localStorage.getItem("semesterId") || 
        (moduleResults.length > 0 ? moduleResults[0].semesterId : 1);
      
      // Call the calculate endpoint
      const response = await axios.post(
        `http://localhost:8081/api/module-results/calculate?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        setCalculationMessage(response.data.message);
        // Refresh the marks data after calculation
        await fetchData();
      } else {
        setError("Calculation failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
        localStorage.removeItem("auth-token");
        navigate("/login");
      } else {
        setError("Failed to calculate marks. Please try again later.");
        console.error(error);
      }
    } finally {
      setCalculating(false);
    }
  };

  // Function to get all unique assignments
  const getAllUniqueAssignments = () => {
    const allAssignments = [];
    moduleResults.forEach(result => {
      result.assignmentDetails.forEach(assignment => {
        if (!allAssignments.some(a => a.id === assignment.id)) {
          allAssignments.push(assignment);
        }
      });
    });
    
    // Sort assignments by ID or name
    return allAssignments.sort((a, b) => a.id - b.id);
  };

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF('landscape');
    const allAssignments = getAllUniqueAssignments();

    // Adding the title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Module Marks", 20, 20);

    // Adding the module details
    doc.setFontSize(12);
    doc.text(`Module Name: ${moduleDetails.name}`, 20, 30);
    doc.text(`Module Code: ${moduleDetails.code}`, 20, 35);
    doc.text(`Department: ${moduleDetails.departmentName}`, 20, 40);
    doc.text(`Intake: ${moduleDetails.intakeName}`, 120, 30);
    doc.text(`Semester: ${moduleDetails.semesterName}`, 120, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 40);

    // Create table headers - student info + all assignments (obtained and weighted separately) + final marks
    const headers = [
      "Reg No", 
      "Student Name"
    ];
    
    // Add assignment columns - now split into obtained and weighted
    allAssignments.forEach(assignment => {
      headers.push(`${assignment.assignmentName} (${assignment.assignmentPercentage}%)`);
      headers.push('Weighted');
    });
    
    // Add final columns
    headers.push("Final Marks", "Grade", "GPA", "Status");

    // Create data rows
    const rows = moduleResults.map(result => {
      const row = [
        result.studentRegNo,
        result.studentName
      ];
      
      // Add each assignment mark and weighted mark as separate columns
      allAssignments.forEach(assignment => {
        const studentAssignment = result.assignmentDetails.find(a => a.id === assignment.id);
        if (studentAssignment) {
          row.push(studentAssignment.marksObtained.toFixed(2));
          row.push(studentAssignment.weightedMarks.toFixed(2));
        } else {
          row.push("N/A");
          row.push("N/A");
        }
      });
      
      // Add final marks, grade and status
      row.push(result.finalMarks.toFixed(2));
      row.push(result.grade);
      row.push(result.gradePoint.toFixed(2));
      row.push(result.status);
      
      return row;
    });

    // Create the table with optimized styling
    doc.autoTable({
      startY: 45,
      head: [headers],
      body: rows,
      theme: "grid",
      headStyles: { 
        fillColor: [22, 160, 133], 
        fontSize: 8,
        cellPadding: 2
      },
      bodyStyles: { 
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Reg No
        1: { cellWidth: 25 }, // Student Name
      },
      margin: { top: 10 },
      didDrawPage: function(data) {
        // Add page number
        doc.setFontSize(8);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // Saving the PDF
    doc.save(`module_marks_${moduleDetails.code}.pdf`);
  };

  // Function to handle student status update
  const handleStatusUpdate = async (resultId, currentStatus) => {
    try {
      // In a real implementation, you would have an API endpoint to update the status
      const newStatus = currentStatus === "PASS" ? "FAIL" : "PASS";
      
      const response = await axios.post(
        `http://localhost:8081/api/module-results/update-status/${resultId}`,
        { newStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status) {
        setCalculationMessage(`Status updated successfully to ${newStatus}`);
        // Refresh data after update
        await fetchData();
      } else {
        setError("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  // Function to view detailed assignment breakdown
  const viewAssignmentDetails = (studentId) => {
    // Store the student ID in localStorage
    localStorage.setItem("studentId", studentId);
    // Navigate to a student detail page
    navigate("/student-assignment-details");
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Get all unique assignments for the table view
  const allAssignments = getAllUniqueAssignments();

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
            label: "Module Marks",
            link: `/viewMarks`,
          },
        ]}
      />
      <div className="mr-[10%] ml-[10%] px-8 font-poppins">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {calculationMessage && <div className="text-green-500 mb-4">{calculationMessage}</div>}

        {/* Detailing Container */}
        <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
          <h2 className="text-xl font-semibold text-blue-950">
            Module Details
          </h2>
          <div className="mt-4">
            <p>
              <strong>Module Name:</strong> {moduleDetails.name}
            </p>
            <p>
              <strong>Module Code:</strong> {moduleDetails.code}
            </p>
            <p>
              <strong>Department:</strong> {moduleDetails.departmentName}
            </p>
            <p>
              <strong>Intake:</strong> {moduleDetails.intakeName}
            </p>
            <p>
              <strong>Semester:</strong> {moduleDetails.semesterName}
            </p>
          </div>
        </div>

        {/* Marks Table - Updated to match PDF format */}
        <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
          <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-blue-950 font-medium">
                  <th className="border border-gray-300 p-2 text-left">Student Reg No</th>
                  <th className="border border-gray-300 p-2 text-left">Student Name</th>
                  
                  {/* Assignment Headers - now with separate columns for obtained and weighted marks */}
                  {allAssignments.map((assignment) => (
                    <React.Fragment key={assignment.id}>
                      <th className="border border-gray-300 p-2 text-left">
                        {assignment.assignmentName} ({assignment.assignmentPercentage}%)
                      </th>
                      <th className="border border-gray-300 p-2 text-left bg-gray-100">
                        Weighted
                      </th>
                    </React.Fragment>
                  ))}
                  
                  <th className="border border-gray-300 p-2 text-left">Final Marks</th>
                  <th className="border border-gray-300 p-2 text-left">Grade</th>
                  <th className="border border-gray-300 p-2 text-left">GPA</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {moduleResults.length > 0 ? (
                  moduleResults.map((result) => (
                    <tr key={result.id} className="text-blue-950">
                      <td className="border border-gray-300 p-2">{result.studentRegNo}</td>
                      <td className="border border-gray-300 p-2">{result.studentName}</td>
                      
                      {/* Assignments - with separate columns for obtained and weighted marks */}
                      {allAssignments.map((assignment) => {
                        const studentAssignment = result.assignmentDetails.find(a => a.id === assignment.id);
                        return (
                          <React.Fragment key={assignment.id}>
                            <td className="border border-gray-300 p-2">
                              {studentAssignment ? studentAssignment.marksObtained.toFixed(2) : "N/A"}
                            </td>
                            <td className="border border-gray-300 p-2 bg-gray-50">
                              {studentAssignment ? studentAssignment.weightedMarks.toFixed(2) : "N/A"}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      
                      <td className="border border-gray-300 p-2">{result.finalMarks.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">{result.grade}</td>
                      <td className="border border-gray-300 p-2">{result.gradePoint.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">
                        <button 
                          onClick={() => handleStatusUpdate(result.id, result.status)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            result.status === "PASS" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {result.status}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4 + (allAssignments.length * 2)} className="text-center text-gray-500 p-4">
                      No marks available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons for Calculate/Print/Download Actions */}
        <div className="text-right mt-6 space-x-4">
          <button
            onClick={calculateMarks}
            disabled={calculating}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 mr-4"
          >
            {calculating ? "Calculating..." : "Calculate Module Marks"}
          </button>
          <button
            onClick={downloadPDF}
            className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900"
          >
            Download PDF
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewMarks;