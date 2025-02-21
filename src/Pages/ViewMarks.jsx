// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosConfig";
// import Header from "../Components/Header";
// import Footer from "../Components/Footer";
// import Breadcrumb from "../Components/Breadcrumb";
// import { jsPDF } from "jspdf"; // Import jsPDF

// const ViewMarks = () => {
//   const [marks, setMarks] = useState([]);
//   const [moduleDetails, setModuleDetails] = useState({});
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const moduleId = localStorage.getItem("moduleId");
//   const token = localStorage.getItem("auth-token");

//   useEffect(() => {
//     // Mock sample data for the marks table
//     const sampleMarksData = [
//       {
//         studentName: "John Doe",
//         regNo: "S12345",
//         marks: 85,
//         grade: "A",
//         gpa: 3.7,
//       },
//       {
//         studentName: "Jane Smith",
//         regNo: "S12346",
//         marks: 78,
//         grade: "B",
//         gpa: 3.3,
//       },
//       {
//         studentName: "Emily Johnson",
//         regNo: "S12347",
//         marks: 92,
//         grade: "A+",
//         gpa: 4.0,
//       },
//       {
//         studentName: "Michael Brown",
//         regNo: "S12348",
//         marks: 65,
//         grade: "C",
//         gpa: 2.5,
//       },
//     ];

//     // Mock sample data for module details
//     const sampleModuleDetails = {
//       name: "Computer Science 101",
//       code: "CS101",
//       gpaStatus: "Normal",
//       credits: 3,
//     };

//     // Set the mock data to state
//     setMarks(sampleMarksData);
//     setModuleDetails(sampleModuleDetails);
//   }, [moduleId, token]);

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
//     doc.text(`GPA Status: ${moduleDetails.gpaStatus}`, 20, 40);
//     doc.text(`Credits: ${moduleDetails.credits}`, 20, 45);

//     // Adding the marks table
//     doc.autoTable({
//       startY: 50,
//       head: [["Student Name", "Reg No", "Marks", "Grade", "GPA"]],
//       body: marks.map((mark) => [
//         mark.studentName,
//         mark.regNo,
//         mark.marks,
//         mark.grade,
//         mark.gpa,
//       ]),
//       theme: "grid",
//       headStyles: { fillColor: [22, 160, 133] }, // Custom header color
//       margin: { top: 10 },
//     });

//     // Saving the PDF
//     doc.save("marks.pdf");
//   };

//   return (
//     <div>
//       <Header />
//       <Breadcrumb />
//       <div className="mr-[10%] ml-[10%] px-8 font-poppins">
//         <div className="py-8 text-center">
//           <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
//         </div>

//         {error && <div className="text-red-500 mb-4">{error}</div>}

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
//               <strong>GPA Status:</strong> {moduleDetails.gpaStatus}
//             </p>
//             <p>
//               <strong>Credits:</strong> {moduleDetails.credits}
//             </p>
//           </div>
//         </div>

//         {/* Marks Table with Sample Data */}
//         <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
//           <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200 text-blue-950 font-medium">
//                 <th className="border border-gray-300 p-2 text-left">
//                   Student Name
//                 </th>
//                 <th className="border border-gray-300 p-2 text-left">Reg No</th>
//                 <th className="border border-gray-300 p-2 text-left">Marks</th>
//                 <th className="border border-gray-300 p-2 text-left">Grade</th>
//                 <th className="border border-gray-300 p-2 text-left">GPA</th>
//               </tr>
//             </thead>
//             <tbody>
//               {marks.length > 0 ? (
//                 marks.map((mark) => (
//                   <tr key={mark.regNo} className="text-blue-950">
//                     <td className="border border-white p-2">
//                       {mark.studentName}
//                     </td>
//                     <td className="border border-white p-2">{mark.regNo}</td>
//                     <td className="border border-white p-2">{mark.marks}</td>
//                     <td className="border border-white p-2">{mark.grade}</td>
//                     <td className="border border-white p-2">{mark.gpa}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center text-gray-500">
//                     No marks available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Buttons for Print/Download Actions */}
//         <div className="text-right mt-6 space-x-4">
//           <button
//             onClick={downloadPDF} // Download PDF button
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

// export default ViewMarks;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Breadcrumb from "../Components/Breadcrumb";
import { jsPDF } from "jspdf"; // Import jsPDF

const ViewMarks = () => {
  const [marks, setMarks] = useState([]);
  const [moduleDetails, setModuleDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const moduleId = localStorage.getItem("moduleId");
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        return;
      }
  
      try {
        // Fetch module details
        const moduleResponse = await axios.get(
          `http://localhost:8081/api/module/${moduleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setModuleDetails(moduleResponse.data);
  
        // Fetch student details
        const studentResponse = await axios.get(
          `http://localhost:8081/api/student/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        // Fetch marks for each student
        const marksPromises = studentResponse.data.map(async (student) => {
          const marksResponse = await axios.get(
            `http://localhost:8081/api/marks/student/${student.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return {
            studentName: student.name,
            regNo: student.regNo,
            marks: marksResponse.data.marks,
            grade: marksResponse.data.grade,
            gpa: marksResponse.data.gpa,
          };
        });
  
        // Wait for all marks to be fetched
        const marksData = await Promise.all(marksPromises);
        setMarks(marksData);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login...");
          localStorage.removeItem("auth-token");
          navigate("/login"); // Redirect to login
        } else {
          setError("Failed to fetch data. Please try again later.");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [moduleId, token, navigate]);

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Adding the title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Module Marks", 20, 20);

    // Adding the module details
    doc.setFontSize(12);
    doc.text(`Module Name: ${moduleDetails.name}`, 20, 30);
    doc.text(`Module Code: ${moduleDetails.code}`, 20, 35);
    doc.text(`GPA Status: ${moduleDetails.gpaStatus}`, 20, 40);
    doc.text(`Credits: ${moduleDetails.credits}`, 20, 45);

    // Adding the marks table
    doc.autoTable({
      startY: 50,
      head: [["Student Name", "Reg No", "Marks", "Grade", "GPA"]],
      body: marks.map((mark) => [
        mark.studentName,
        mark.regNo,
        mark.marks,
        mark.grade,
        mark.gpa,
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] }, // Custom header color
      margin: { top: 10 },
    });

    // Saving the PDF
    doc.save("marks.pdf");
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>; // Show loading message
  }

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="mr-[10%] ml-[10%] px-8 font-poppins">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

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
              <strong>GPA Status:</strong> {moduleDetails.gpaStatus}
            </p>
            <p>
              <strong>Credits:</strong> {moduleDetails.credits}
            </p>
          </div>
        </div>

        {/* Marks Table with Sample Data */}
        <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
          <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-blue-950 font-medium">
                <th className="border border-gray-300 p-2 text-left">
                  Student Name
                </th>
                <th className="border border-gray-300 p-2 text-left">Reg No</th>
                <th className="border border-gray-300 p-2 text-left">Marks</th>
                <th className="border border-gray-300 p-2 text-left">Grade</th>
                <th className="border border-gray-300 p-2 text-left">GPA</th>
              </tr>
            </thead>
            <tbody>
              {marks.length > 0 ? (
                marks.map((mark) => (
                  <tr key={mark.regNo} className="text-blue-950">
                    <td className="border border-white p-2">
                      {mark.studentName}
                    </td>
                    <td className="border border-white p-2">{mark.regNo}</td>
                    <td className="border border-white p-2">{mark.marks}</td>
                    <td className="border border-white p-2">{mark.grade}</td>
                    <td className="border border-white p-2">{mark.gpa}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No marks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Buttons for Print/Download Actions */}
        <div className="text-right mt-6 space-x-4">
          <button
            onClick={downloadPDF} // Download PDF button
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

//changes made by me