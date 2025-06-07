import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from "../../Components/Breadcrumb";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import Modal from 'react-modal';

// Set app element for accessibility
Modal.setAppElement('#root');

// Create a separate component for the table row with modal
const StudentRowWithModal = ({ result, allAssignments, handleStatusUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <React.Fragment>
      <tr 
        className="text-blue-950 hover:bg-gray-50 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <td className="border border-gray-300 p-2 sticky left-0 bg-white z-10">{result.studentRegNo}</td>
        <td className="border border-gray-300 p-2 sticky left-[100px] bg-white z-10 hidden md:table-cell">{result.studentName}</td>
        
        {/* Assignments - hidden on small screens */}
        {allAssignments.map((assignment) => {
          const studentAssignment = result.assignmentDetails.find(a => a.id === assignment.id);
          return (
            <React.Fragment key={assignment.id}>
              <td className="border border-gray-300 p-2 hidden md:table-cell">
                {studentAssignment ? studentAssignment.marksObtained.toFixed(2) : "N/A"}
              </td>
              <td className="border border-gray-300 p-2 bg-gray-50 hidden md:table-cell">
                {studentAssignment ? studentAssignment.weightedMarks.toFixed(2) : "N/A"}
              </td>
            </React.Fragment>
          );
        })}
        
        <td className="border border-gray-300 p-2 hidden sm:table-cell">{result.finalMarks.toFixed(2)}</td>
        <td className="border border-gray-300 p-2 ">{result.grade}</td>
        <td className="border border-gray-300 p-2 hidden sm:table-cell">{result.gradePoint.toFixed(2)}</td>
        <td className="border border-gray-300 p-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate(result.id, result.status);
            }}
            className={`px-2 py-1 rounded-full text-xs ${
              result.status === "PASS" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {result.status}
          </button>
        </td>
      </tr>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Student Marks Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-950">
              {result.studentName} ({result.studentRegNo})
            </h3>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Assignments:</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Assignment</th>
                  <th className="p-2 text-left">Marks</th>
                  <th className="p-2 text-left">Weighted</th>
                </tr>
              </thead>
              <tbody>
                {result.assignmentDetails.map((assignment) => (
                  <tr key={assignment.id} className="border-b">
                    <td className="p-2">{assignment.assignmentName}</td>
                    <td className="p-2">{assignment.marksObtained.toFixed(2)}</td>
                    <td className="p-2">{assignment.weightedMarks.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Final Marks:</strong> {result.finalMarks.toFixed(2)}</p>
              <p><strong>Grade:</strong> {result.grade}</p>
            </div>
            <div>
              <p><strong>GPA:</strong> {result.gradePoint.toFixed(2)}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  result.status === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {result.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const ViewMarks = () => {
  const [moduleResults, setModuleResults] = useState([]);
  const [moduleDetails, setModuleDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState("");
  const navigate = useNavigate();

  const moduleId = localStorage.getItem("moduleId");
  const departmentId = localStorage.getItem("departmentId") || 1;
  const intakeId = localStorage.getItem("intakeId") || 1;
  const semesterId = localStorage.getItem("semesterId") || 1;
  const token = localStorage.getItem("auth-token");

  const fetchData = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `/module-results/module?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.length > 0) {
        setModuleResults(response.data);
        const firstResult = response.data[0];
        setModuleDetails({
          name: firstResult.moduleName,
          code: localStorage.getItem("moduleCode") || "N/A",
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
        localStorage.removeItem("auth-token");
        navigate("/login");
      } else {
        setError("Failed to fetch data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleId, navigate]);

  const calculateMarks = async () => {
    setCalculating(true);
    setCalculationMessage("");
    
    try {
      const response = await axios.post(
        `/module-results/calculate?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        setCalculationMessage(response.data.message);
        await fetchData();
      } else {
        setError("Calculation failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("auth-token");
        navigate("/login");
      } else {
        setError("Failed to calculate marks. Please try again later.");
      }
    } finally {
      setCalculating(false);
    }
  };

  const getAllUniqueAssignments = () => {
    const allAssignments = [];
    moduleResults.forEach(result => {
      result.assignmentDetails.forEach(assignment => {
        if (!allAssignments.some(a => a.id === assignment.id)) {
          allAssignments.push(assignment);
        }
      });
    });
    return allAssignments.sort((a, b) => a.id - b.id);
  };

  const downloadPDF = () => {
    const doc = new jsPDF('landscape');
    const allAssignments = getAllUniqueAssignments();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Module Marks", 20, 20);

    doc.setFontSize(12);
    doc.text(`Module Name: ${moduleDetails.name}`, 20, 30);
    doc.text(`Module Code: ${moduleDetails.code}`, 20, 35);
    doc.text(`Department: ${moduleDetails.departmentName}`, 20, 40);
    doc.text(`Intake: ${moduleDetails.intakeName}`, 120, 30);
    doc.text(`Semester: ${moduleDetails.semesterName}`, 120, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 40);

    const headers = ["Reg No", "Student Name"];
    allAssignments.forEach(assignment => {
      headers.push(`${assignment.assignmentName} (${assignment.assignmentPercentage}%)`);
      headers.push('Weighted');
    });
    headers.push("Final Marks", "Grade", "GPA", "Status");

    const rows = moduleResults.map(result => {
      const row = [result.studentRegNo, result.studentName];
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
      row.push(result.finalMarks.toFixed(2));
      row.push(result.grade);
      row.push(result.gradePoint.toFixed(2));
      row.push(result.status);
      return row;
    });

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
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
      },
      margin: { top: 10 },
      didDrawPage: function(data) {
        doc.setFontSize(8);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`module_marks_${moduleDetails.code}.pdf`);
  };

  const handleStatusUpdate = async (resultId, currentStatus) => {
    try {
      const newStatus = currentStatus === "PASS" ? "FAIL" : "PASS";
      const response = await axios.post(
        `/module-results/update-status/${resultId}`,
        { newStatus: newStatus }
      );
      
      if (response.data.status) {
        setCalculationMessage(`Status updated successfully to ${newStatus}`);
        await fetchData();
      } else {
        setError("Failed to update status. Please try again.");
      }
    } catch (error) {
      setError("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const allAssignments = getAllUniqueAssignments();

  return (
    <div>
      <Header />
      <Breadcrumb
        breadcrumb={[
          { label: "Degree Programs", link: `/departments` },
          { label: "Intakes", link: `/departments/${departmentId}/intakes` },
          { label: "Semesters", link: `/departments/${departmentId}/intakes/${intakeId}/semesters` },
          { label: "Modules", link: `/departments/${departmentId}/intakes/semesters/modules` },
          { label: "Module Assessments", link: `/departments/${moduleId}/intakes/semesters/modules/assignments` },
          { label: "Module Marks", link: `/viewMarks` },
        ]}
      />
      <div className="md:mr-[10%] md:ml-[10%] px-8 font-poppins">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {calculationMessage && <div className="text-green-500 mb-4">{calculationMessage}</div>}

        <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
          <h2 className="text-xl font-semibold text-blue-950">Module Details</h2>
          <div className="mt-4">
            <p><strong>Module Name:</strong> {moduleDetails.name}</p>
            <p><strong>Module Code:</strong> {moduleDetails.code}</p>
            <p><strong>Department:</strong> {moduleDetails.departmentName}</p>
            <p><strong>Intake:</strong> {moduleDetails.intakeName}</p>
            <p><strong>Semester:</strong> {moduleDetails.semesterName}</p>
          </div>
        </div>

        <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
          <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
          <div className="relative">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-blue-950 font-medium">
                      <th className="border border-gray-300 p-2 text-left sticky left-0 bg-gray-200 z-10">Reg No</th>
                      <th className="border border-gray-300 p-2 text-left sticky left-[100px] bg-gray-200 z-10 hidden md:table-cell">Name</th>
                      {allAssignments.map((assignment) => (
                        <React.Fragment key={assignment.id}>
                          <th className="border border-gray-300 p-2 text-left hidden md:table-cell">
                            <span className="hidden sm:inline">{assignment.assignmentName}</span> ({assignment.assignmentPercentage}%)
                          </th>
                          <th className="border border-gray-300 p-2 text-left bg-gray-100 hidden md:table-cell">
                            Weighted
                          </th>
                        </React.Fragment>
                      ))}
                      <th className="border border-gray-300 p-2 text-left hidden sm:table-cell">Final</th>
                      <th className="border border-gray-300 p-2 text-left ">Grade</th>
                      <th className="border border-gray-300 p-2 text-left hidden sm:table-cell">GPA</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moduleResults.length > 0 ? (
                      moduleResults.map((result) => (
                        <StudentRowWithModal 
                          key={result.id}
                          result={result}
                          allAssignments={allAssignments}
                          handleStatusUpdate={handleStatusUpdate}
                        />
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
          </div>
        </div>

        <div className="text-right mt-6 space-x-4 ">
          <button
            onClick={calculateMarks}
            disabled={calculating}
            className="bg-green-600 text-white px-4 py-2 my-2 rounded-lg font-medium hover:bg-green-700"
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