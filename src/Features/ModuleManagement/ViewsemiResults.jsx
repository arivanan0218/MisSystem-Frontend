import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from "../../Components/Breadcrumb";
import { jsPDF } from "jspdf";
import { FaArrowUp } from "react-icons/fa";

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const detailsRefs = useRef({});

  // useEffect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //  scroll function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // function to handle view button click
  const handleViewClick = (studentId) => {
    const detailRow = document.getElementById(`student-details-${studentId}`);
    if (detailRow) {
      detailRow.classList.toggle("hidden");
      if (!detailRow.classList.contains("hidden")) {
        // Scroll to the expanded details
        setTimeout(() => {
          detailRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  };

  // Function to fetch all student results for the semester
  const fetchAllStudentResults = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Fetch all students in the department/intake/semester
      const studentsResponse = await axios.get(
        `/student/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (studentsResponse.data && studentsResponse.data.length > 0) {
        // For each student, fetch their semester results
        const resultsPromises = studentsResponse.data.map(async (student) => {
          try {
            const response = await axios.get(
              `/module-registration/student?studentId=${student.id}&semesterId=${semesterId}&intakeId=${intakeId}&departmentId=${departmentId}`,
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
        console.log("Semester Results:", results);
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
        `/semester-results/calculate/${departmentId}/${intakeId}/${semesterId}`,
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
    doc.text(`Intake: ${localStorage.getItem("intakeBatch") || "Unknown"}`, 20, 35);
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
        module.name,
        module.code,
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
    let totalCredits = 0;
    
    modules.forEach(module => {
      // Get the grade value - might be in different properties
      const grade = module.grade || module.moduleGrade;
      // Get the credits - default to 1 if not specified
      const credits = module.credits || module.moduleCredits || 1;
      
      // Check if we have a valid grade
      if (grade && gradePoints[grade] !== undefined) {
        // If we have credits, use weighted calculation
        if (credits) {
          totalPoints += gradePoints[grade] * credits;
          totalCredits += credits;
        } else {
          // Otherwise just sum the grade points
          totalPoints += gradePoints[grade];
          totalModules++;
        }
      }
    });
    
    // If we have credits, use them for calculation
    if (totalCredits > 0) {
      return (totalPoints / totalCredits).toFixed(2);
    }
    
    // Otherwise use module count
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

  // Helper function to get color class based on GPA
  const getGpaClass = (gpa) => {
    if (gpa === "N/A") return "text-gray-500";
    const numGpa = parseFloat(gpa);
    if (numGpa >= 3.7) return "text-green-600 font-bold";
    if (numGpa >= 3.0) return "text-green-500";
    if (numGpa >= 2.3) return "text-yellow-600";
    if (numGpa >= 2.0) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

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
            label: "Semester Results",
            link: `/semesterResults`,
          },
        ]}
      />
      <div className="sm:mr-[10%] sm:ml-[10%] mx-[2%] font-poppins overflow-x-hidden">
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
              <strong>Intake:</strong> {localStorage.getItem("intakeBatch") || "Unknown"}
            </p>
            <p>
              <strong>Semester:</strong> {semesterDetails.semesterName}
            </p>
          </div>
        </div>

        {/* Students Results Summary Table */}
        <div className="p-6 rounded-lg mb-8 shadow-md bg-white overflow-x-auto">
          <h2 className="font-medium text-blue-950 mb-6">Students Summary</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-blue-950 font-medium">
                <th className="border border-gray-300 p-2 text-left hidden sm:table-cell">Student Name</th>
                <th className="border border-gray-300 p-2 text-left">Reg No</th>
                <th className="border border-gray-300 p-2 text-left">No. of Modules</th>
                <th className="border border-gray-300 p-2 text-left">GPA</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {semesterResults.length > 0 ? (
                semesterResults.map((student) => (
                  <tr key={student.id} className="text-blue-950 break-words">
                    <td className="border border-white p-2 break-words hidden sm:table-cell">{student.studentName}</td>
                    <td className="border border-white p-2 break-words">{student.studentRegNo}</td>
                    <td className="border border-white p-2">{student.modules.length}</td>
                    <td className={`border border-white p-2 ${getGpaClass(calculateGPA(student.modules))}`}>
                      {calculateGPA(student.modules)}
                    </td>
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
                        /* onClick={() => {
                          const detailRow = document.getElementById(`student-details-${student.id}`);
                          if (detailRow) {
                            detailRow.classList.toggle("hidden");
                          }
                        }} */
                        onClick={() => handleViewClick(student.id)}
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

      {/* Scroll to Top button just before the Footer */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-950 text-white p-3 rounded-full shadow-lg hover:bg-blue-900 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
        {/* Expandable Module Details for each student */}
        {semesterResults.length > 0 && (
          <div className="space-y-6 mb-8">
            {semesterResults.map((student) => (
              <div 
                key={`student-details-${student.id}`}
                id={`student-details-${student.id}`}
                className="p-6 rounded-lg shadow-md bg-white hidden overflow-x-auto"
              >
                <h3 className="font-medium text-blue-950 mb-4">
                  {student.studentName} ({student.studentRegNo}) - Module Details
                </h3>
                <table className="min-w-full border-collapse border border-gray-300">
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
                          <td className="border border-white p-2 break-words">{module.moduleName || module.name}</td>
                          <td className="border border-white p-2 break-words">{module.moduleCode || module.code}</td>
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
        <div className="flex md:justify-end md:flex-row flex-col text-right mt-6 gap-2">
          <button
            onClick={calculateSemesterResults}
            disabled={calculating}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
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