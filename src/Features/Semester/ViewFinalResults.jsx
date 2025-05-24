import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from "../../Components/Breadcrumb";
import { jsPDF } from "jspdf";

const ViewFinalResults = () => {
  const [finalResults, setFinalResults] = useState([]);
  const [programDetails, setProgramDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState("");
  const navigate = useNavigate();

  // Get IDs from localStorage
  const departmentId = localStorage.getItem("departmentId") || 1;
  const intakeId = localStorage.getItem("intakeId") || 1;
  const token = localStorage.getItem("auth-token");  

  // Function to fetch final results
  const fetchFinalResults = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Fetch final results
      const response = await axios.get(
        `http://localhost:8081/api/final-results/${departmentId}/${intakeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.length > 0) {
        setFinalResults(response.data);
        
        // Extract program details from first result
        const firstResult = response.data[0];
        setProgramDetails({
          departmentName: firstResult.departmentName,
          intakeName: firstResult.intakeName,
          semesters: firstResult.semesterNames,
          weights: firstResult.semesterWeights
        });
      } else {
        setError("No final results found.");
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
    fetchFinalResults();
  }, [departmentId, intakeId, navigate]);

  // Function to calculate final results
  const calculateFinalResults = async () => {
    setCalculating(true);
    setCalculationMessage("");
    
    try {
      // Call the calculate endpoint
      const response = await axios.post(
        `http://localhost:8081/api/final-results/calculate/${departmentId}/${intakeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        setCalculationMessage(response.data.message);
        // Refresh the results after calculation
        await fetchFinalResults();
      } else {
        setError("Calculation failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
        localStorage.removeItem("auth-token");
        navigate("/login");
      } else {
        setError("Failed to calculate final results. Please try again later.");
        console.error(error);
      }
    } finally {
      setCalculating(false);
    }
  };

  // Helper function to get class for GPA (color coding)
  const getGpaClass = (gpa) => {
    if (gpa >= 3.7) return "text-green-600 font-bold";
    if (gpa >= 3.0) return "text-green-500";
    if (gpa >= 2.3) return "text-yellow-600";
    if (gpa >= 2.0) return "text-yellow-500";
    return "text-red-500";
  };

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Adding the title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Final Results", 20, 20);

    // Adding the program details
    doc.setFontSize(12);
    doc.text(`Department: ${programDetails.departmentName}`, 20, 30);
    doc.text(`Intake: ${programDetails.intakeName}`, 20, 35);

    // Create data for the main results table
    const tableData = finalResults.map(result => [
      result.studentName,
      result.studentRegNo,
      result.overallGpa.toFixed(2),
      result.status
    ]);

    // Adding the results table
    doc.autoTable({
      startY: 40,
      head: [["Student Name", "Reg No", "Final GPA", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    // For each student, add their detailed semester results
    let yPosition = doc.autoTable.previous.finalY + 10;
    
    finalResults.forEach((result, index) => {
      // Add a page break if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Student name as header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Student: ${result.studentName} (${result.studentRegNo})`, 20, yPosition);
      
      // Create semester data
      const semesterData = result.semesterNames.map((name, idx) => [
        name,
        result.semesterGpas[idx].toFixed(2),
        result.semesterWeights[idx].toFixed(2),
        (result.semesterGpas[idx] * result.semesterWeights[idx]).toFixed(2)
      ]);
      
      // Add semester details table
      doc.autoTable({
        startY: yPosition + 5,
        head: [["Semester", "GPA", "Weight", "Contribution"]],
        body: semesterData,
        theme: "grid",
        headStyles: { fillColor: [100, 100, 220] },
        margin: { top: 10 },
      });
      
      // Add final score
      doc.setFont("helvetica", "bold");
      doc.text(`Final GPA: ${result.overallGpa.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 10);
      doc.text(`Status: ${result.status}`, 150, doc.autoTable.previous.finalY + 15);
      
      yPosition = doc.autoTable.previous.finalY + 25;
    });

    // Saving the PDF
    doc.save("final_results.pdf");
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
          <h1 className="text-2xl font-bold text-blue-950">Final Program Results</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {calculationMessage && <div className="text-green-500 mb-4">{calculationMessage}</div>}

        {/* Program Details Container */}
        <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
          <h2 className="text-xl font-semibold text-blue-950">
            Program Details
          </h2>
          <div className="mt-4">
            <p>
              <strong>Department:</strong> {programDetails.departmentName}
            </p>
            <p>
              <strong>Intake:</strong> {programDetails.intakeName}
            </p>
            <p>
              <strong>Number of Semesters:</strong> {programDetails.semesters ? programDetails.semesters.length : 0}
            </p>
          </div>
        </div>

        {/* Final Results Table */}
        <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
          <h2 className="font-medium text-blue-950 mb-6">Final Results Summary</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-blue-950 font-medium">
                <th className="border border-gray-300 p-2 text-left">Student Name</th>
                <th className="border border-gray-300 p-2 text-left">Reg No</th>
                <th className="border border-gray-300 p-2 text-left">Final GPA</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {finalResults.length > 0 ? (
                finalResults.map((result) => (
                  <tr key={result.id} className="text-blue-950">
                    <td className="border border-white p-2">{result.studentName}</td>
                    <td className="border border-white p-2">{result.studentRegNo}</td>
                    <td className={`border border-white p-2 ${getGpaClass(result.overallGpa)}`}>
                      {result.overallGpa.toFixed(2)}
                    </td>
                    <td className="border border-white p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.status === "Pass" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="border border-white p-2">
                      <button 
                        onClick={() => {
                          // Toggle the expanded view
                          const detailRow = document.getElementById(`student-details-${result.id}`);
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
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    No results available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expandable Semester Details for each student */}
        {finalResults.length > 0 && (
          <div className="space-y-6 mb-8">
            {finalResults.map((result) => (
              <div 
                key={`student-details-${result.id}`}
                id={`student-details-${result.id}`}
                className="p-6 rounded-lg shadow-md bg-white hidden"
              >
                <h3 className="font-medium text-blue-950 mb-4">
                  {result.studentName} ({result.studentRegNo}) - Semester Results
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-blue-950 font-medium">
                      <th className="border border-gray-300 p-2 text-left">Semester</th>
                      <th className="border border-gray-300 p-2 text-left">GPA</th>
                      <th className="border border-gray-300 p-2 text-left">Weight</th>
                      <th className="border border-gray-300 p-2 text-left">Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.semesterNames.length > 0 ? (
                      result.semesterNames.map((name, idx) => (
                        <tr key={`${result.id}-semester-${idx}`} className="text-blue-950">
                          <td className="border border-white p-2">{name}</td>
                          <td className={`border border-white p-2 ${getGpaClass(result.semesterGpas[idx])}`}>
                            {result.semesterGpas[idx].toFixed(2)}
                          </td>
                          <td className="border border-white p-2">
                            {result.semesterWeights[idx].toFixed(2)}
                          </td>
                          <td className="border border-white p-2">
                            {(result.semesterGpas[idx] * result.semesterWeights[idx]).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-gray-500 p-4">
                          No semester results available.
                        </td>
                      </tr>
                    )}
                    {/* Total Row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="border border-white p-2">Final Result</td>
                      <td className={`border border-white p-2 ${getGpaClass(result.overallGpa)}`}>
                        {result.overallGpa.toFixed(2)}
                      </td>
                      <td className="border border-white p-2">
                        {result.semesterWeights.reduce((sum, weight) => sum + weight, 0).toFixed(2)}
                      </td>
                      <td className="border border-white p-2">
                        {result.overallGpa.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Buttons for Calculate/Print/Download Actions */}
        <div className="text-right mt-6 space-x-4">
          <button
            onClick={calculateFinalResults}
            disabled={calculating}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 mr-4"
          >
            {calculating ? "Calculating..." : "Calculate Final Results"}
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

export default ViewFinalResults;