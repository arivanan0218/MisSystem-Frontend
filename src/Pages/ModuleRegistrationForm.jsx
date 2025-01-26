import React, { useState, useEffect, useRef } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Breadcrumb from "../Components/Breadcrumb";
import axios from "../axiosConfig"; // For API requests
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

const ModuleRegistrationForm = () => {
  const [studentDetails, setStudentDetails] = useState({
    name: "John Doe",
    regNumber: "20231234",
    department: "Computer Science",
  });

  const [registeredModules, setRegisteredModules] = useState([
    { code: "EE 4350", name: "Module 1", gpaStatus: "G" },
    { code: "EE 4256", name: "Module 2", gpaStatus: "G" },
    { code: "EE 4133", name: "Module 3", gpaStatus: "N" },
    { code: "EE 4140", name: "Module 4", gpaStatus: "G" },
    { code: "EE 4133", name: "Module 5", gpaStatus: "N" },
    { code: "EE 4133", name: "Module 6", gpaStatus: "G" },
    { code: "EE 4133", name: "Module 7", gpaStatus: "G" },
  ]);

  const componentRef = useRef(); // Ref for the printable content

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get("/student/modules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setStudentDetails(response.data.studentDetails);
          setRegisteredModules(response.data.registeredModules);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Module_Registration_Form",
  });

  // Function to download as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Module Registration Form", 14, 10);

    // Add student details
    doc.text(`Name: ${studentDetails.name}`, 14, 20);
    doc.text(`Registration No: ${studentDetails.regNumber}`, 14, 30);
    doc.text(`Department: ${studentDetails.department}`, 14, 40);

    // Prepare table data
    const tableColumnHeaders = ["Module Code", "Module Name", "GPA Status"];
    const tableRows = registeredModules.map((module) => [
      module.code,
      module.name,
      module.gpaStatus,
    ]);

    // Use the autoTable method
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 50, // Position the table below the student details
    });

    // Save the PDF
    doc.save("Module_Registration_Form.pdf");
  };

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="mr-[10%] ml-[10%] px-8 font-poppins">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold text-blue-950">
            Module Registration Form
          </h1>
        </div>

        {/* Printable Content */}
        <div ref={componentRef}>
          {/* Student Details Section */}
          <div className="p-6 rounded-lg mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="font-semibold text-blue-950">Name:</label>
                <div className="bg-white border border-gray-300 rounded-lg p-2">
                  {studentDetails.name}
                </div>
              </div>
              <div>
                <label className="font-semibold text-blue-950">
                  Registration No:
                </label>
                <div className="bg-white border border-gray-300 rounded-lg p-2">
                  {studentDetails.regNumber}
                </div>
              </div>
              <div className="col-span-2">
                <label className="font-semibold text-blue-950">
                  Department:
                </label>
                <div className="bg-white border border-gray-300 rounded-lg p-2">
                  {studentDetails.department}
                </div>
              </div>
            </div>
          </div>

          {/* Registered Modules Section */}
          <div>
            <h2 className="font-medium text-blue-950 mb-6">Selected Modules</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-blue-950 font-medium">
                  <th className="border border-gray-300 p-2 text-left">
                    Module Code
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Module Name
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    GPA Status G/N
                  </th>
                </tr>
              </thead>
              <tbody>
                {registeredModules.map((module, index) => (
                  <tr key={index}>
                    <td className="border border-white p-2 text-blue-950">
                      {module.code}
                    </td>
                    <td className="border border-white p-2 text-blue-950">
                      {module.name}
                    </td>
                    <td className="border border-white p-2 text-blue-950">
                      {module.gpaStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-right mt-6 space-x-4">
          <button
            onClick={handlePrint}
            className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900"
          >
            Preview
          </button>
          <button
            onClick={handleDownloadPDF}
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

export default ModuleRegistrationForm;
