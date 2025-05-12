

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosConfig";
// import Header from "../Components/Header";
// import Footer from "../Components/Footer";
// import Breadcrumb from "../Components/Breadcrumb";
// import { jsPDF } from "jspdf"; // Import jsPDF
// import autoTable from 'jspdf-autotable'; // Make sure this is imported

// const ViewsemiMarks = () => {
//   const [moduleResults, setModuleResults] = useState([]);
//   const [moduleDetails, setModuleDetails] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [calculating, setCalculating] = useState(false);
//   const [calculationMessage, setCalculationMessage] = useState("");
//   const navigate = useNavigate();

//   const moduleId = localStorage.getItem("moduleId");
//   const token = localStorage.getItem("auth-token");

//   // Function to fetch module results
//   const fetchData = async () => {
//     const token = localStorage.getItem("auth-token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       // Get departmentId, intakeId, and semesterId from localStorage
//       const departmentId = localStorage.getItem("departmentId") || 1;
//       const intakeId = localStorage.getItem("intakeId") || 1;
//       const semesterId = localStorage.getItem("semesterId") || 1;

//       // Fetch module results
//       const response = await axios.get(
//         `http://localhost:8081/api/module-results/module?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data && response.data.length > 0) {
//         setModuleResults(response.data);
        
//         // Extract module details from first result
//         const firstResult = response.data[0];
//         setModuleDetails({
//           name: firstResult.moduleName,
//           code: `MOD-${firstResult.moduleId}`, // Assuming moduleId can be used as code
//           departmentName: firstResult.departmentName,
//           semesterName: firstResult.semesterName,
//           intakeName: firstResult.intakeName,
//           credits: localStorage.getItem("moduleCredits") || 3 // Default or from localStorage
//         });
//       } else {
//         setError("No module results found.");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         console.error("Unauthorized: Redirecting to login...");
//         localStorage.removeItem("auth-token");
//         navigate("/login");
//       } else {
//         setError("Failed to fetch data. Please try again later.");
//         console.error(error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [moduleId, navigate]);

//   // Function to calculate module marks
//   const calculateMarks = async () => {
//     setCalculating(true);
//     setCalculationMessage("");
    
//     try {
//       // Get required IDs from localStorage
//       const departmentId = localStorage.getItem("departmentId") || 
//         (moduleResults.length > 0 ? moduleResults[0].departmentId : 1);
//       const intakeId = localStorage.getItem("intakeId") || 
//         (moduleResults.length > 0 ? moduleResults[0].intakeId : 1);
//       const semesterId = localStorage.getItem("semesterId") || 
//         (moduleResults.length > 0 ? moduleResults[0].semesterId : 1);
      
//       // Call the calculate endpoint
//       const response = await axios.post(
//         `http://localhost:8081/api/module-results/calculate?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
      
//       if (response.data.status) {
//         setCalculationMessage(response.data.message);
//         // Refresh the marks data after calculation
//         await fetchData();
//       } else {
//         setError("Calculation failed. Please try again.");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         console.error("Unauthorized: Redirecting to login...");
//         localStorage.removeItem("auth-token");
//         navigate("/login");
//       } else {
//         setError("Failed to calculate marks. Please try again later.");
//         console.error(error);
//       }
//     } finally {
//       setCalculating(false);
//     }
//   };

//   // Function to generate and download PDF
//   const downloadPDF = () => {
//     const doc = new jsPDF();

//     // Adding the title
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(18);
//     doc.text("Module Marks", 20, 20);

//     // Adding the module details
//     doc.setFontSize(12);
//     doc.text(`Module Name: ${moduleDetails.name}`, 20, 30);
//     doc.text(`Module Code: ${moduleDetails.code}`, 20, 35);
//     doc.text(`Department: ${moduleDetails.departmentName}`, 20, 40);
//     doc.text(`Intake: ${moduleDetails.intakeName}`, 20, 45);
//     doc.text(`Semester: ${moduleDetails.semesterName}`, 20, 50);

//     // Adding the marks table
//     doc.autoTable({
//       startY: 55,
//       head: [["Student Name", "Reg No", "Final Marks", "Grade", "Status"]],
//       body: moduleResults.map((result) => [
//         result.studentName,
//         result.studentRegNo,
//         result.finalMarks,
//         result.grade,
//         result.status
//       ]),
//       theme: "grid",
//       headStyles: { fillColor: [22, 160, 133] },
//       margin: { top: 10 },
//     });

//     // Saving the PDF
//     doc.save("module_marks.pdf");
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <Breadcrumb />
//       <div className="mr-[10%] ml-[10%] px-8 font-poppins">
//         <div className="py-8 text-center">
//           <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
//         </div>

//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         {calculationMessage && <div className="text-green-500 mb-4">{calculationMessage}</div>}

//         {/* Detailing Container */}
//         <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
//           <h2 className="text-xl font-semibold text-blue-950">
//             Module Details
//           </h2>
//           <div className="mt-4">
//             <p>
//               <strong>Module Name:</strong> {moduleDetails.name}
//             </p>
//             <p>
//               <strong>Module Code:</strong> {moduleDetails.code}
//             </p>
//             <p>
//               <strong>Department:</strong> {moduleDetails.departmentName}
//             </p>
//             <p>
//               <strong>Intake:</strong> {moduleDetails.intakeName}
//             </p>
//             <p>
//               <strong>Semester:</strong> {moduleDetails.semesterName}
//             </p>
//           </div>
//         </div>

//         {/* Marks Table */}
//         <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
//           <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200 text-blue-950 font-medium">
//                 <th className="border border-gray-300 p-2 text-left">Student Name</th>
//                 <th className="border border-gray-300 p-2 text-left">Reg No</th>
//                 <th className="border border-gray-300 p-2 text-left">Final Marks</th>
//                 <th className="border border-gray-300 p-2 text-left">Grade</th>
//                 <th className="border border-gray-300 p-2 text-left">Status</th>
//                 <th className="border border-gray-300 p-2 text-left">Assignments</th>
//               </tr>
//             </thead>
//             <tbody>
//               {moduleResults.length > 0 ? (
//                 moduleResults.map((result) => (
//                   <tr key={result.id} className="text-blue-950">
//                     <td className="border border-white p-2">{result.studentName}</td>
//                     <td className="border border-white p-2">{result.studentRegNo}</td>
//                     <td className="border border-white p-2">{result.finalMarks}</td>
//                     <td className="border border-white p-2">{result.grade}</td>
//                     <td className="border border-white p-2">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         result.status === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                       }`}>
//                         {result.status}
//                       </span>
//                     </td>
//                     <td className="border border-white p-2">
//                       <div className="text-xs">
//                         {result.assignmentDetails.map((assignment) => (
//                           <div key={assignment.id} className="mb-1">
//                             <span className="font-semibold">{assignment.assignmentName}</span>: {assignment.marksObtained}/{assignment.assignmentPercentage} 
//                             <span className="text-gray-500 ml-1">(weighted: {assignment.weightedMarks})</span>
//                           </div>
//                         ))}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center text-gray-500 p-4">
//                     No marks available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Buttons for Calculate/Print/Download Actions */}
//         <div className="text-right mt-6 space-x-4">
//           <button
//             onClick={calculateMarks}
//             disabled={calculating}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 mr-4"
//           >
//             {calculating ? "Calculating..." : "Calculate Module Marks"}
//           </button>
//           <button
//             onClick={downloadPDF}
//             className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900"
//           >
//             Download PDF
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ViewsemiMarks;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Breadcrumb from "../Components/Breadcrumb";
import { jsPDF } from "jspdf";

const ViewSemiResults = () => {
  const [semesterResults, setSemesterResults] = useState([]);
  const [semesterDetails, setSemesterDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState("");
  const navigate = useNavigate();

  // Get IDs from localStorage
  const departmentId = localStorage.getItem("departmentId") || 1;
  const intakeId = localStorage.getItem("intakeId") || 1;
  const semesterId = localStorage.getItem("semesterId") || 1;
  const token = localStorage.getItem("auth-token");

  // Function to fetch all student results for the semester
  const fetchAllStudentResults = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Fetch all students in the department/intake/semester
      const studentsResponse = await axios.get(
        `http://localhost:8081/api/student/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (studentsResponse.data && studentsResponse.data.length > 0) {
        // For each student, fetch their semester results
        const resultsPromises = studentsResponse.data.map(async (student) => {
          try {
            const response = await axios.get(
              `http://localhost:8081/api/module-registration/student?studentId=${student.id}&semesterId=${semesterId}&intakeId=${intakeId}&departmentId=${departmentId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return response.data;
          } catch (error) {
            console.error(`Error fetching results for student ${student.id}:`, error);
            return null;
          }
        });

        const results = (await Promise.all(resultsPromises)).filter(result => result !== null);
        setSemesterResults(results);

        // Set semester details
        setSemesterDetails({
          departmentName: results.length > 0 ? results[0].departmentName : "Unknown",
          intakeName: localStorage.getItem("intakeName") || "Unknown",
          semesterName: localStorage.getItem("semesterName") || `Semester ${semesterId}`,
        });
      } else {
        setError("No students found for this semester.");
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
    fetchAllStudentResults();
  }, [departmentId, intakeId, semesterId, navigate]);

  // Function to calculate semester results
  const calculateSemesterResults = async () => {
    setCalculating(true);
    setCalculationMessage("");
    
    try {
      // Call the calculate endpoint
      const response = await axios.post(
        `http://localhost:8081/api/semester-results/calculate/${departmentId}/${intakeId}/${semesterId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        setCalculationMessage(response.data.message);
        // Refresh the results data after calculation
        await fetchAllStudentResults();
      } else {
        setError("Calculation failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
        localStorage.removeItem("auth-token");
        navigate("/login");
      } else {
        setError("Failed to calculate semester results. Please try again later.");
        console.error(error);
      }
    } finally {
      setCalculating(false);
    }
  };

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Adding the title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Semester Results", 20, 20);

    // Adding the semester details
    doc.setFontSize(12);
    doc.text(`Department: ${semesterDetails.departmentName}`, 20, 30);
    doc.text(`Intake: ${semesterDetails.intakeName}`, 20, 35);
    doc.text(`Semester: ${semesterDetails.semesterName}`, 20, 40);

    // Create data for the main student table
    const tableData = semesterResults.map(student => [
      student.studentName,
      student.studentRegNo,
      student.modules.length,
      calculateGPA(student.modules),
      getOverallStatus(student.modules)
    ]);

    // Adding the students table
    doc.autoTable({
      startY: 45,
      head: [["Student Name", "Reg No", "Modules", "GPA", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    // For each student, add their detailed module results
    let yPosition = doc.autoTable.previous.finalY + 10;
    
    semesterResults.forEach((student, index) => {
      // Add a page break if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Student name as header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Student: ${student.studentName} (${student.studentRegNo})`, 20, yPosition);
      
      // Create module data
      const moduleData = student.modules.map(module => [
        module.moduleName,
        module.moduleCode,
        module.grade,
        module.status
      ]);
      
      // Add module table
      doc.autoTable({
        startY: yPosition + 5,
        head: [["Module Name", "Code", "Grade", "Status"]],
        body: moduleData,
        theme: "grid",
        headStyles: { fillColor: [100, 100, 220] },
        margin: { top: 10 },
      });
      
      yPosition = doc.autoTable.previous.finalY + 15;
    });

    // Saving the PDF
    doc.save("semester_results.pdf");
  };

  // Helper function to calculate GPA from modules
  const calculateGPA = (modules) => {
    if (!modules || modules.length === 0) return "N/A";
    
    // This is a simplified GPA calculation - adjust according to your grading system
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0, 'E': 0.0
    };
    
    let totalPoints = 0;
    let totalModules = 0;
    
    modules.forEach(module => {
      // Only count modules with valid grades
      if (module.grade && gradePoints[module.grade] !== undefined) {
        totalPoints += gradePoints[module.grade];
        totalModules++;
      }
    });
    
    if (totalModules === 0) return "N/A";
    return (totalPoints / totalModules).toFixed(2);
  };

  // Helper function to determine overall semester status
  const getOverallStatus = (modules) => {
    if (!modules || modules.length === 0) return "N/A";
    
    // Check if any module is failed
    const failedModules = modules.filter(module => 
      module.status === "FAIL" || module.status === "Fail" || module.grade === "F" || module.grade === "E"
    );
    
    return failedModules.length > 0 ? "FAIL" : "PASS";
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="mr-[10%] ml-[10%] px-8 font-poppins">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold text-blue-950">Semester Results</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {calculationMessage && <div className="text-green-500 mb-4">{calculationMessage}</div>}

        {/* Semester Details Container */}
        <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
          <h2 className="text-xl font-semibold text-blue-950">
            Semester Details
          </h2>
          <div className="mt-4">
            <p>
              <strong>Department:</strong> {semesterDetails.departmentName}
            </p>
            <p>
              <strong>Intake:</strong> {semesterDetails.intakeName}
            </p>
            <p>
              <strong>Semester:</strong> {semesterDetails.semesterName}
            </p>
          </div>
        </div>

        {/* Students Results Summary Table */}
        <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
          <h2 className="font-medium text-blue-950 mb-6">Students Summary</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-blue-950 font-medium">
                <th className="border border-gray-300 p-2 text-left">Student Name</th>
                <th className="border border-gray-300 p-2 text-left">Reg No</th>
                <th className="border border-gray-300 p-2 text-left">Modules</th>
                <th className="border border-gray-300 p-2 text-left">GPA</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {semesterResults.length > 0 ? (
                semesterResults.map((student) => (
                  <tr key={student.id} className="text-blue-950">
                    <td className="border border-white p-2">{student.studentName}</td>
                    <td className="border border-white p-2">{student.studentRegNo}</td>
                    <td className="border border-white p-2">{student.modules.length}</td>
                    <td className="border border-white p-2">{calculateGPA(student.modules)}</td>
                    <td className="border border-white p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        getOverallStatus(student.modules) === "PASS" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {getOverallStatus(student.modules)}
                      </span>
                    </td>
                    <td className="border border-white p-2">
                      <button 
                        onClick={() => {
                          // Store student ID for the detail view if needed
                          localStorage.setItem("selectedStudentId", student.id);
                          // Navigate to student detail view or expand in-place
                          // navigate(`/student/${student.id}/semester-results`);
                          
                          // For now, just toggle the expanded view
                          const detailRow = document.getElementById(`student-details-${student.id}`);
                          if (detailRow) {
                            detailRow.classList.toggle("hidden");
                          }
                        }}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs hover:bg-blue-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-4">
                    No results available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expandable Module Details for each student */}
        {semesterResults.length > 0 && (
          <div className="space-y-6 mb-8">
            {semesterResults.map((student) => (
              <div 
                key={`student-details-${student.id}`}
                id={`student-details-${student.id}`}
                className="p-6 rounded-lg shadow-md bg-white hidden"
              >
                <h3 className="font-medium text-blue-950 mb-4">
                  {student.studentName} ({student.studentRegNo}) - Module Details
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-blue-950 font-medium">
                      <th className="border border-gray-300 p-2 text-left">Module Name</th>
                      <th className="border border-gray-300 p-2 text-left">Code</th>
                      <th className="border border-gray-300 p-2 text-left">Grade</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.modules.length > 0 ? (
                      student.modules.map((module, idx) => (
                        <tr key={`${student.id}-module-${idx}`} className="text-blue-950">
                          <td className="border border-white p-2">{module.moduleName}</td>
                          <td className="border border-white p-2">{module.moduleCode}</td>
                          <td className="border border-white p-2">{module.grade}</td>
                          <td className="border border-white p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              module.status === "PASS" || module.status === "Taken" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {module.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-gray-500 p-4">
                          No modules available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Buttons for Calculate/Print/Download Actions */}
        <div className="text-right mt-6 space-x-4">
          <button
            onClick={calculateSemesterResults}
            disabled={calculating}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 mr-4"
          >
            {calculating ? "Calculating..." : "Calculate Semester Results"}
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

export default ViewSemiResults;