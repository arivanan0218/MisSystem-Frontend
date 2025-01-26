// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Header from "../Components/Header";
// import Breadcrumb from "../Components/Breadcrumb";
// import Footer from "../Components/Footer";
// import axios from "../axiosConfig"; // Import axios for HTTP requests
// import UploadMarks from "../Components/UploadMarks"; // Import UploadMarks component

// const Marks = () => {
//   const [marks, setMarks] = useState([]);
//   const [formOpen, setFormOpen] = useState(false); // State to control form visibility
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1); // State to track the current page
//   const [itemsPerPage] = useState(10); // Number of items per page

//   // Get IDs from localStorage
//   const token = localStorage.getItem("auth-token");
//   const departmentId = localStorage.getItem("departmentId");
//   const intakeId = localStorage.getItem("intakeId");
//   const semesterId = localStorage.getItem("semesterId");
//   const moduleId = localStorage.getItem("moduleId");
//   const assignmentId = localStorage.getItem("assignmentId");

//   const openForm = () => setFormOpen(true); // Open the form
//   const closeForm = () => setFormOpen(false); // Close the form

//   // Fetch marks from API
//   useEffect(() => {
//     const fetchMarks = async () => {
//       try {
//         if (
//           !departmentId ||
//           !intakeId ||
//           !semesterId ||
//           !moduleId ||
//           !assignmentId
//         ) {
//           setError("Required data missing from localStorage.");
//           return;
//         }

//         const response = await axios.get(
//           `/marks/assignment/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}&assignmentId=${assignmentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status !== 200) {
//           throw new Error(`Failed to fetch marks: ${response.statusText}`);
//         }

//         const data = response.data;
//         console.log("Fetched marks:", data); // Log fetched data for debugging

//         if (Array.isArray(data)) {
//           setMarks(data); // Set the marks directly
//         } else {
//           throw new Error("Invalid data structure from API");
//         }
//       } catch (error) {
//         console.error("Error fetching marks:", error);
//         setError("Could not fetch marks. Please try again later.");
//       }
//     };

//     fetchMarks();
//   }, [departmentId, intakeId, semesterId, moduleId, assignmentId, token]);

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentMarks = marks.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(marks.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div>
//       <Header />
//       <Breadcrumb />
//       <div className="mr-[20%] ml-[10%] px-8 font-poppins">
//         {/* Search and Add Marks Button */}
//         <div className="py-8 flex items-center justify-between">
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
//           />
//           <div>
//             <button
//               onClick={openForm}
//               className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[160px] h-[41px] ml-4"
//               aria-label="Add Marks"
//             >
//               Add Marks +
//             </button>
//           </div>
//         </div>

//         {/* Table Display */}
//         <div className="mt-[80px]">
//           {error && (
//             <div className="text-center text-red-500 mb-4">{error}</div>
//           )}

//           {currentMarks.length > 0 ? (
//             <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
//               <table className="min-w-full table-auto text-sm text-left text-gray-500">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
//                     <th className="px-6 py-3 font-semibold text-gray-700">Marks</th>
//                     <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {currentMarks.map((mark) => (
//                     <tr key={mark.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{mark.studentName || "Unnamed Student"}</td>
//                       <td className="px-6 py-4">{mark.obtainedMarks || "No Marks"}</td>
//                       <td className="px-6 py-4">
//                         <Link
//                           to={`/marks/${mark.id}`}
//                           onClick={() => localStorage.setItem("markId", mark.id)}
//                           className="text-blue-600 hover:underline"
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">No marks available.</div>
//           )}
//         </div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center mt-6 space-x-2">
//             {Array.from({ length: totalPages }, (_, index) => (
//               <button
//                 key={index + 1}
//                 onClick={() => paginate(index + 1)}
//                 className={`px-4 py-2 rounded-md ${
//                   currentPage === index + 1
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Popup for Add Marks */}
//       {formOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//           onClick={closeForm}
//         >
//           <div
//             className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h1 className="text-blue-950 text-2xl font-semibold">Upload Marks</h1>
//             <UploadMarks closeForm={closeForm} />
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default Marks;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Header from "../Components/Header";
// import Breadcrumb from "../Components/Breadcrumb";
// import Footer from "../Components/Footer";
// import axios from "../axiosConfig"; // Import axios for HTTP requests
// import UploadMarks from "../Components/UploadMarks"; // Import UploadMarks component

// const Marks = () => {
//   const [marks, setMarks] = useState([]);
//   const [assignmentDetails, setAssignmentDetails] = useState({});
//   const [formOpen, setFormOpen] = useState(false); // State to control form visibility
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // LocalStorage data
//   const token = localStorage.getItem("auth-token");
//   const departmentId = localStorage.getItem("departmentId");
//   const intakeId = localStorage.getItem("intakeId");
//   const semesterId = localStorage.getItem("semesterId");
//   const moduleId = localStorage.getItem("moduleId");
//   const assignmentId = localStorage.getItem("assignmentId");

//   // Open and close the form
//   const openForm = () => setFormOpen(true);
//   const closeForm = () => setFormOpen(false);

//   const fetchAssignmentDetails = async () => {
//     try {
//       if (!assignmentId) {
//         throw new Error("Assignment ID is missing from localStorage.");
//       }

//       const response = await axios.get(`/assignment/${assignmentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         setAssignmentDetails(response.data || {});
//       } else {
//         throw new Error(`Failed to fetch assignment details: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error fetching assignment details:", error);
//       setError("Could not fetch assignment details. Please try again later.");
//     }
//   };

//   // Fetch marks from API
//   useEffect(() => {
//     const fetchMarks = async () => {
//       try {
//         if (
//           !departmentId ||
//           !intakeId ||
//           !semesterId ||
//           !moduleId ||
//           !assignmentId
//         ) {
//           setError("Required data missing from localStorage.");
//           return;
//         }

//         const response = await axios.get(
//           `/marks/assignment/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}&assignmentId=${assignmentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status !== 200) {
//           throw new Error(`Failed to fetch marks: ${response.statusText}`);
//         }

//         setMarks(response.data);
//       } catch (error) {
//         console.error("Error fetching marks:", error);
//         setError("Could not fetch marks. Please try again later.");
//       }
//     };

//     fetchMarks();
//   }, [departmentId, intakeId, semesterId, moduleId, assignmentId, token]);

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentMarks = marks.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(marks.length / itemsPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   useEffect(() => {
//     setLoading(true);
//     fetchAssignmentDetails();
//   }, [assignmentId, departmentId, intakeId, semesterId, moduleId, token]);

//   return (
//     <div>
//       <Header />
//       <Breadcrumb breadcrumb={[{ label: "Home", link: "/" }, { label: "Marks", link: "/marks" }]} />
//       <div className="mr-[20%] ml-[10%] px-8 font-poppins">
//         {/* Search and Add Marks */}
//         <div className="py-8 flex items-center justify-between">
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
//           />
//           <button
//             onClick={openForm}
//             className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
//             aria-label="Add Marks"
//           >
//             Add Marks +
//           </button>
//         </div>

//         {/* Assignment Details Section */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-2">Assignment Details</h2>
//           <p>
//             <strong>Assignment Name:</strong> {assignmentDetails.assignmentName || "N/A"}
//           </p>
//           <p>
//             <strong>Percentage:</strong> {assignmentDetails.assignmentPercentage || "N/A"}
//           </p>
//           <p>
//             <strong>Duration:</strong> {assignmentDetails.assignmentDuration || "N/A"}
//           </p>
//         </div>

//         {/* Marks Table */}
//         <div className="mt-[80px]">
//           {error && <div className="text-center text-red-500 mb-4">{error}</div>}
//           {currentMarks.length > 0 ? (
//             <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
//               <table className="min-w-full table-auto text-sm text-left text-gray-500">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
//                     <th className="px-6 py-3 font-semibold text-gray-700">Marks</th>
//                     <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {currentMarks.map((mark) => (
//                     <tr key={mark.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{mark.studentName || "Unnamed Student"}</td>
//                       <td className="px-6 py-4">{mark.obtainedMarks || "No Marks"}</td>
//                       <td className="px-6 py-4">
//                         <Link
//                           to={`/marks/${mark.id}`}
//                           onClick={() => localStorage.setItem("markId", mark.id)}
//                           className="text-blue-600 hover:underline"
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">No marks available.</div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center mt-6 space-x-2">
//             {Array.from({ length: totalPages }, (_, index) => (
//               <button
//                 key={index + 1}
//                 onClick={() => paginate(index + 1)}
//                 className={`px-4 py-2 rounded-md ${
//                   currentPage === index + 1
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Popup for Add Marks */}
//       {formOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//           onClick={closeForm}
//         >
//           <div
//             className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h1 className="text-blue-950 text-2xl font-semibold">Upload Marks</h1>
//             <UploadMarks closeForm={closeForm} />
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={closeForm}
//                 className="px-4 py-2 bg-white text-blue-950 border border-blue-950 rounded-lg mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={closeForm}
//                 className="px-4 py-2 bg-blue-950 text-white border border-blue-950 rounded-lg"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default Marks;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Breadcrumb from "../Components/Breadcrumb";
import Footer from "../Components/Footer";
import axios from "../axiosConfig"; // Import axios for HTTP requests
import UploadMarks from "../Components/UploadMarks"; // Import UploadMarks component

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [assignmentDetails, setAssignmentDetails] = useState({});
  const [formOpen, setFormOpen] = useState(false); // State to control form visibility
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Open and close the form
  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const fetchAssignmentDetails = async () => {
    try {
      if (!assignmentId) {
        throw new Error("Assignment ID is missing from localStorage.");
      }

      const response = await axios.get(`/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
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
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        if (
          !departmentId ||
          !intakeId ||
          !semesterId ||
          !moduleId ||
          !assignmentId
        ) {
          setError("Required data missing from localStorage.");
          return;
        }

        const response = await axios.get(
          `/marks/assignment/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}&assignmentId=${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch marks: ${response.statusText}`);
        }

        setMarks(response.data);
      } catch (error) {
        console.error("Error fetching marks:", error);
        setError("Could not fetch marks. Please try again later.");
      }
    };

    fetchMarks();
  }, [departmentId, intakeId, semesterId, moduleId, assignmentId, token]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMarks = marks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(marks.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setLoading(true);
    fetchAssignmentDetails();
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
          <button
            onClick={openForm}
            className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
            aria-label="Add Marks"
          >
            Add Marks +
          </button>
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
        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {currentMarks.length > 0 ? (
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
                      <td className="px-6 py-4">{mark.registerNo || "No Register No"}</td>
                      <td className="px-6 py-4">{mark.studentName || "Unnamed Student"}</td>
                      <td className="px-6 py-4">{mark.obtainedMarks || "No Marks"}</td>
                      <td className="px-6 py-4">
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
                      </td>
                    </tr>
                  ))}
                  {/* Add empty rows if currentMarks has fewer than 10 rows */}
                  {currentMarks.length < itemsPerPage && (
                    Array.from({ length: itemsPerPage - currentMarks.length }).map((_, idx) => (
                      <tr key={`empty-row-${idx}`} className="bg-gray-100">
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">-</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">No marks available.</div>
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
            <UploadMarks closeForm={closeForm} />
            <div className="flex justify-end mt-4">
              {/* <button
                onClick={closeForm}
                className="px-4 py-2 bg-white text-blue-950 border border-blue-950 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={closeForm}
                className="px-4 py-2 bg-blue-950 text-white border border-blue-950 rounded-lg"
              >
                Submit
              </button> */}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Marks;


