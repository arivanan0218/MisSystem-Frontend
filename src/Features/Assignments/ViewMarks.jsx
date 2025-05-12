// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "../axiosConfig";
// // // import Header from "../Components/Header";
// // // import Footer from "../Components/Footer";
// // // import Breadcrumb from "../Components/Breadcrumb";
// // // import { jsPDF } from "jspdf"; // Import jsPDF

// // // const ViewMarks = () => {
// // //   const [marks, setMarks] = useState([]);
// // //   const [moduleDetails, setModuleDetails] = useState({});
// // //   const [error, setError] = useState(null);
// // //   const navigate = useNavigate();

// // //   const moduleId = localStorage.getItem("moduleId");
// // //   const token = localStorage.getItem("auth-token");

// // //   useEffect(() => {
// // //     // Mock sample data for the marks table
// // //     const sampleMarksData = [
// // //       {
// // //         studentName: "John Doe",
// // //         regNo: "S12345",
// // //         marks: 85,
// // //         grade: "A",
// // //         gpa: 3.7,
// // //       },
// // //       {
// // //         studentName: "Jane Smith",
// // //         regNo: "S12346",
// // //         marks: 78,
// // //         grade: "B",
// // //         gpa: 3.3,
// // //       },
// // //       {
// // //         studentName: "Emily Johnson",
// // //         regNo: "S12347",
// // //         marks: 92,
// // //         grade: "A+",
// // //         gpa: 4.0,
// // //       },
// // //       {
// // //         studentName: "Michael Brown",
// // //         regNo: "S12348",
// // //         marks: 65,
// // //         grade: "C",
// // //         gpa: 2.5,
// // //       },
// // //     ];

// // //     // Mock sample data for module details
// // //     const sampleModuleDetails = {
// // //       name: "Computer Science 101",
// // //       code: "CS101",
// // //       gpaStatus: "Normal",
// // //       credits: 3,
// // //     };

// // //     // Set the mock data to state
// // //     setMarks(sampleMarksData);
// // //     setModuleDetails(sampleModuleDetails);
// // //   }, [moduleId, token]);

// // //   // Function to generate and download PDF
// // //   const downloadPDF = () => {
// // //     const doc = new jsPDF();

// // //     // Adding the title
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(18);
// // //     doc.text("Module Marks", 20, 20);

// // //     // Adding the module details
// // //     doc.setFontSize(12);
// // //     doc.text(`Module Name: ${moduleDetails.name}`, 20, 30);
// // //     doc.text(`Module Code: ${moduleDetails.code}`, 20, 35);
// // //     doc.text(`GPA Status: ${moduleDetails.gpaStatus}`, 20, 40);
// // //     doc.text(`Credits: ${moduleDetails.credits}`, 20, 45);

// // //     // Adding the marks table
// // //     doc.autoTable({
// // //       startY: 50,
// // //       head: [["Student Name", "Reg No", "Marks", "Grade", "GPA"]],
// // //       body: marks.map((mark) => [
// // //         mark.studentName,
// // //         mark.regNo,
// // //         mark.marks,
// // //         mark.grade,
// // //         mark.gpa,
// // //       ]),
// // //       theme: "grid",
// // //       headStyles: { fillColor: [22, 160, 133] }, // Custom header color
// // //       margin: { top: 10 },
// // //     });

// // //     // Saving the PDF
// // //     doc.save("marks.pdf");
// // //   };

// // //   return (
// // //     <div>
// // //       <Header />
// // //       <Breadcrumb />
// // //       <div className="mr-[10%] ml-[10%] px-8 font-poppins">
// // //         <div className="py-8 text-center">
// // //           <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
// // //         </div>

// // //         {error && <div className="text-red-500 mb-4">{error}</div>}

// // //         {/* Detailing Container */}
// // //         <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
// // //           <h2 className="text-xl font-semibold text-blue-950">
// // //             Module Details
// // //           </h2>
// // //           <div className="mt-4">
// // //             <p>
// // //               <strong>Module Name:</strong> {moduleDetails.name}
// // //             </p>
// // //             <p>
// // //               <strong>Module Code:</strong> {moduleDetails.code}
// // //             </p>
// // //             <p>
// // //               <strong>GPA Status:</strong> {moduleDetails.gpaStatus}
// // //             </p>
// // //             <p>
// // //               <strong>Credits:</strong> {moduleDetails.credits}
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* Marks Table with Sample Data */}
// // //         <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
// // //           <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
// // //           <table className="w-full border-collapse border border-gray-300">
// // //             <thead>
// // //               <tr className="bg-gray-200 text-blue-950 font-medium">
// // //                 <th className="border border-gray-300 p-2 text-left">
// // //                   Student Name
// // //                 </th>
// // //                 <th className="border border-gray-300 p-2 text-left">Reg No</th>
// // //                 <th className="border border-gray-300 p-2 text-left">Marks</th>
// // //                 <th className="border border-gray-300 p-2 text-left">Grade</th>
// // //                 <th className="border border-gray-300 p-2 text-left">GPA</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {marks.length > 0 ? (
// // //                 marks.map((mark) => (
// // //                   <tr key={mark.regNo} className="text-blue-950">
// // //                     <td className="border border-white p-2">
// // //                       {mark.studentName}
// // //                     </td>
// // //                     <td className="border border-white p-2">{mark.regNo}</td>
// // //                     <td className="border border-white p-2">{mark.marks}</td>
// // //                     <td className="border border-white p-2">{mark.grade}</td>
// // //                     <td className="border border-white p-2">{mark.gpa}</td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan="5" className="text-center text-gray-500">
// // //                     No marks available.
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         {/* Buttons for Print/Download Actions */}
// // //         <div className="text-right mt-6 space-x-4">
// // //           <button
// // //             onClick={downloadPDF} // Download PDF button
// // //             className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900"
// // //           >
// // //             Download PDF
// // //           </button>
// // //         </div>
// // //       </div>
// // //       <Footer />
// // //     </div>
// // //   );
// // // };

// // // export default ViewMarks;

// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "../axiosConfig";
// // import Header from "../Components/Header";
// // import Footer from "../Components/Footer";
// // import Breadcrumb from "../Components/Breadcrumb";
// // import { jsPDF } from "jspdf"; // Import jsPDF

// // const ViewMarks = () => {
// //   const [marks, setMarks] = useState([]);
// //   const [moduleDetails, setModuleDetails] = useState({});
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(true); // Add loading state
// //   const navigate = useNavigate();

// //   const moduleId = localStorage.getItem("moduleId");
// //   const token = localStorage.getItem("auth-token");

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem("auth-token");
// //       if (!token) {
// //         navigate("/login"); // Redirect to login if no token is found
// //         return;
// //       }
  
// //       try {
// //         // Fetch module details
// //         const moduleResponse = await axios.get(
// //           `http://localhost:8081/api/module/${moduleId}`,
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           }
// //         );
// //         setModuleDetails(moduleResponse.data);
  
// //         // Fetch student details
// //         const studentResponse = await axios.get(
// //           `http://localhost:8081/api/student/`,
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           }
// //         );
  
// //         // Fetch marks for each student
// //         const marksPromises = studentResponse.data.map(async (student) => {
// //           const marksResponse = await axios.get(
// //             `http://localhost:8081/api/marks/student/${student.id}`,
// //             {
// //               headers: { Authorization: `Bearer ${token}` },
// //             }
// //           );
// //           return {
// //             studentName: student.name,
// //             regNo: student.regNo,
// //             marks: marksResponse.data.marks,
// //             grade: marksResponse.data.grade,
// //             gpa: marksResponse.data.gpa,
// //           };
// //         });
  
// //         // Wait for all marks to be fetched
// //         const marksData = await Promise.all(marksPromises);
// //         setMarks(marksData);
// //       } catch (error) {
// //         if (error.response && error.response.status === 401) {
// //           console.error("Unauthorized: Redirecting to login...");
// //           localStorage.removeItem("auth-token");
// //           navigate("/login"); // Redirect to login
// //         } else {
// //           setError("Failed to fetch data. Please try again later.");
// //           console.error(error);
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
  
// //     fetchData();
// //   }, [moduleId, token, navigate]);

// //   // Function to generate and download PDF
// //   const downloadPDF = () => {
// //     const doc = new jsPDF();

// //     // Adding the title
// //     doc.setFont("helvetica", "bold");
// //     doc.setFontSize(18);
// //     doc.text("Module Marks", 20, 20);

// //     // Adding the module details
// //     doc.setFontSize(12);
// //     doc.text(`Module Name: ${moduleDetails.name}`, 20, 30);
// //     doc.text(`Module Code: ${moduleDetails.code}`, 20, 35);
// //     doc.text(`GPA Status: ${moduleDetails.gpaStatus}`, 20, 40);
// //     doc.text(`Credits: ${moduleDetails.credits}`, 20, 45);

// //     // Adding the marks table
// //     doc.autoTable({
// //       startY: 50,
// //       head: [["Student Name", "Reg No", "Marks", "Grade", "GPA"]],
// //       body: marks.map((mark) => [
// //         mark.studentName,
// //         mark.regNo,
// //         mark.marks,
// //         mark.grade,
// //         mark.gpa,
// //       ]),
// //       theme: "grid",
// //       headStyles: { fillColor: [22, 160, 133] }, // Custom header color
// //       margin: { top: 10 },
// //     });

// //     // Saving the PDF
// //     doc.save("marks.pdf");
// //   };

// //   if (loading) {
// //     return <div className="text-center py-8">Loading...</div>; // Show loading message
// //   }

// //   return (
// //     <div>
// //       <Header />
// //       <Breadcrumb />
// //       <div className="mr-[10%] ml-[10%] px-8 font-poppins">
// //         <div className="py-8 text-center">
// //           <h1 className="text-2xl font-bold text-blue-950">Module Marks</h1>
// //         </div>

// //         {error && <div className="text-red-500 mb-4">{error}</div>}

// //         {/* Detailing Container */}
// //         <div className="p-6 rounded-lg mb-8 bg-gray-100 shadow-md">
// //           <h2 className="text-xl font-semibold text-blue-950">
// //             Module Details
// //           </h2>
// //           <div className="mt-4">
// //             <p>
// //               <strong>Module Name:</strong> {moduleDetails.name}
// //             </p>
// //             <p>
// //               <strong>Module Code:</strong> {moduleDetails.code}
// //             </p>
// //             <p>
// //               <strong>GPA Status:</strong> {moduleDetails.gpaStatus}
// //             </p>
// //             <p>
// //               <strong>Credits:</strong> {moduleDetails.credits}
// //             </p>
// //           </div>
// //         </div>

// //         {/* Marks Table with Sample Data */}
// //         <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
// //           <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
// //           <table className="w-full border-collapse border border-gray-300">
// //             <thead>
// //               <tr className="bg-gray-200 text-blue-950 font-medium">
// //                 <th className="border border-gray-300 p-2 text-left">
// //                   Student Name
// //                 </th>
// //                 <th className="border border-gray-300 p-2 text-left">Reg No</th>
// //                 <th className="border border-gray-300 p-2 text-left">Marks</th>
// //                 <th className="border border-gray-300 p-2 text-left">Grade</th>
// //                 <th className="border border-gray-300 p-2 text-left">GPA</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {marks.length > 0 ? (
// //                 marks.map((mark) => (
// //                   <tr key={mark.regNo} className="text-blue-950">
// //                     <td className="border border-white p-2">
// //                       {mark.studentName}
// //                     </td>
// //                     <td className="border border-white p-2">{mark.regNo}</td>
// //                     <td className="border border-white p-2">{mark.marks}</td>
// //                     <td className="border border-white p-2">{mark.grade}</td>
// //                     <td className="border border-white p-2">{mark.gpa}</td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="5" className="text-center text-gray-500">
// //                     No marks available.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Buttons for Print/Download Actions */}
// //         <div className="text-right mt-6 space-x-4">
// //           <button
// //             onClick={downloadPDF} // Download PDF button
// //             className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900"
// //           >
// //             Download PDF
// //           </button>
// //         </div>
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default ViewMarks;

// // //changes made by me


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
//   const [loading, setLoading] = useState(true);
//   const [calculating, setCalculating] = useState(false); // New state for calculation status
//   const [calculationMessage, setCalculationMessage] = useState(""); // New state for calculation message
//   const navigate = useNavigate();

//   const moduleId = localStorage.getItem("moduleId");
//   const token = localStorage.getItem("auth-token");

//   // Fetch data function for initial load and refresh after calculation
//   const fetchData = async () => {
//     const token = localStorage.getItem("auth-token");
//     if (!token) {
//       navigate("/login"); // Redirect to login if no token is found
//       return;
//     }

//     try {
//       // Fetch module details
//       const moduleResponse = await axios.get(
//         `http://localhost:8081/api/module/${moduleId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setModuleDetails(moduleResponse.data);

//       // Fetch student details
//       const studentResponse = await axios.get(
//         `http://localhost:8081/api/student/`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Fetch marks for each student
//       const marksPromises = studentResponse.data.map(async (student) => {
//         const marksResponse = await axios.get(
//           `http://localhost:8081/api/marks/student/${student.id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         return {
//           studentName: student.name,
//           regNo: student.regNo,
//           marks: marksResponse.data.marks,
//           grade: marksResponse.data.grade,
//           gpa: marksResponse.data.gpa,
//         };
//       });

//       // Wait for all marks to be fetched
//       const marksData = await Promise.all(marksPromises);
//       setMarks(marksData);
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         console.error("Unauthorized: Redirecting to login...");
//         localStorage.removeItem("auth-token");
//         navigate("/login"); // Redirect to login
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
//   }, [moduleId, token, navigate]);

//   // Function to calculate module marks
//   const calculateMarks = async () => {
//     setCalculating(true);
//     setCalculationMessage("");
    
//     try {
//       // Get required IDs from localStorage or from moduleDetails
//       const departmentId = localStorage.getItem("departmentId") || moduleDetails.departmentId;
//       const intakeId = localStorage.getItem("intakeId") || moduleDetails.intakeId;
//       const semesterId = localStorage.getItem("semesterId") || moduleDetails.semesterId;
      
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

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>; // Show loading message
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

//         {/* Buttons for Calculate/Print/Download Actions */}
//         <div className="text-right mt-6 space-x-4">
//           <button
//             onClick={calculateMarks} // Calculate button
//             disabled={calculating}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 mr-4"
//           >
//             {calculating ? "Calculating..." : "Calculate Module Marks"}
//           </button>
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
import axios from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from "../../Components/Breadcrumb";
import { jsPDF } from "jspdf"; // Import jsPDF
import autoTable from 'jspdf-autotable'; // Make sure this is imported

const ViewMarks = () => {
  const [moduleResults, setModuleResults] = useState([]);
  const [moduleDetails, setModuleDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState("");
  const navigate = useNavigate();

  const moduleId = localStorage.getItem("moduleId");
  const token = localStorage.getItem("auth-token");

  // Function to fetch module results
  const fetchData = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Get departmentId, intakeId, and semesterId from localStorage
      const departmentId = localStorage.getItem("departmentId") || 1;
      const intakeId = localStorage.getItem("intakeId") || 1;
      const semesterId = localStorage.getItem("semesterId") || 1;

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
          code: `MOD-${firstResult.moduleId}`, // Assuming moduleId can be used as code
          departmentName: firstResult.departmentName,
          semesterName: firstResult.semesterName,
          intakeName: firstResult.intakeName,
          credits: localStorage.getItem("moduleCredits") || 3 // Default or from localStorage
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
    doc.text(`Department: ${moduleDetails.departmentName}`, 20, 40);
    doc.text(`Intake: ${moduleDetails.intakeName}`, 20, 45);
    doc.text(`Semester: ${moduleDetails.semesterName}`, 20, 50);

    // Adding the marks table
    doc.autoTable({
      startY: 55,
      head: [["Student Name", "Reg No", "Final Marks", "Grade", "Status"]],
      body: moduleResults.map((result) => [
        result.studentName,
        result.studentRegNo,
        result.finalMarks,
        result.grade,
        result.status
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    // Saving the PDF
    doc.save("module_marks.pdf");
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

        {/* Marks Table */}
        <div className="p-6 rounded-lg mb-8 shadow-md bg-white">
          <h2 className="font-medium text-blue-950 mb-6">Student Marks</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-blue-950 font-medium">
                <th className="border border-gray-300 p-2 text-left">Student Name</th>
                <th className="border border-gray-300 p-2 text-left">Reg No</th>
                <th className="border border-gray-300 p-2 text-left">Final Marks</th>
                <th className="border border-gray-300 p-2 text-left">Grade</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Assignments</th>
              </tr>
            </thead>
            <tbody>
              {moduleResults.length > 0 ? (
                moduleResults.map((result) => (
                  <tr key={result.id} className="text-blue-950">
                    <td className="border border-white p-2">{result.studentName}</td>
                    <td className="border border-white p-2">{result.studentRegNo}</td>
                    <td className="border border-white p-2">{result.finalMarks}</td>
                    <td className="border border-white p-2">{result.grade}</td>
                    <td className="border border-white p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.status === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="border border-white p-2">
                      <div className="text-xs">
                        {result.assignmentDetails.map((assignment) => (
                          <div key={assignment.id} className="mb-1">
                            <span className="font-semibold">{assignment.assignmentName}</span>: {assignment.marksObtained}/{assignment.assignmentPercentage} 
                            <span className="text-gray-500 ml-1">(weighted: {assignment.weightedMarks})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-4">
                    No marks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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