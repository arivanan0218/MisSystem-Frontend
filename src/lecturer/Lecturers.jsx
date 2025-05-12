// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import Header from "../Components/Header";
// // import Breadcrumb from "../Components/Breadcrumb";
// // import Footer from "../Components/Footer";
// // import axios from "../axiosConfig";
// // import AddLecturerForm from "./AddLecturerForm";
// // import AddLecturerForm from "../Components/AddLecturerForm"; // New component for adding lecturers

// import { useState, useEffect } from "react";

// import Header from "../Components/Header";
// import Breadcrumb from "../Components/Breadcrumb";
// import Footer from "../Components/Footer";
// import axios from "../axiosConfig"; // Import axios for HTTP requests
// import UploadLecturers from "./UploadLecturer";
// import DataTable from "../Components/DataTable"; // Import the new DataTable component


// const Lecturers = () => {
//   const [lecturers, setLecturers] = useState([]);
//   const [lecturerDetails, setLecturerDetails] = useState({});
//   const [formOpen, setFormOpen] = useState(false);
//   const [error, setError] = useState(null);
//   //const [loading, setLoading] = useState(true);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // LocalStorage data
//   const token = localStorage.getItem("auth-token");
//   //const departmentId = localStorage.getItem("departmentId");

//   const openForm = () => setFormOpen(true);
//   const closeForm = () => setFormOpen(false);

// useEffect(() => {
//   const fetchLecturers = async () => {
//     try {
//       // Send request to fetch all lecturers
//       const response = await axios.get(`/lecturer/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status !== 200) {
//         throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
//       }

//       setLecturers(response.data);
//     } catch (error) {
//       console.error("Error fetching lecturers:", error);
//       setError("Could not fetch lecturers. Please try again later.");
//     }
//   };

//   fetchLecturers();
// }, [token]);



//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentLecturers = lecturers.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(lecturers.length / itemsPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div>
//       <Header />
//       <Breadcrumb breadcrumb={[{ label: "Home", link: "/" }, { label: "Lecturers", link: "/lecturers" }]} />
//       <div className="mr-[20%] ml-[10%] px-8 font-poppins">
//         {/* Search and Add Lecturer */}
//         <div className="py-8 flex items-center justify-between">
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
//           />
//           <button
//             onClick={openForm}
//             className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
//             aria-label="Add Lecturer"
//           >
//             Add Lecturer +
//           </button>
//           {formOpen && <UploadLecturers />}
//         </div>

//         {/* Lecturer Details Section */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-2">Department Details</h2>
//           <p>
//             <strong>Department Name:</strong> {lecturerDetails.name || "N/A"}
//           </p>
//           {/* <p>
//             <strong>Email:</strong> {lecturerDetails.email || "N/A"}
//           </p>
//           <p>
//             <strong>Department:</strong> {lecturerDetails.department || "N/A"}
//           </p> */}
//         </div>

//         {/* Lecturers Table */}
//         <DataTable data={lecturers} />
//         <div className="mt-[80px]">
//           {error && 
//           <div className="text-center text-red-500 mb-4">{error}</div>}
//             {lecturers.length > 0 ? (
//               <DataTable data={lecturers} />
//               ) : (
//          <div className="text-center text-gray-500">No lecturers available.</div>
//         )}
//         </div>

//       </div>

//       {/* Popup for Add Lecturer */}
//       {formOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//           onClick={closeForm}
//         >
//           <div
//             className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h1 className="text-blue-950 text-2xl font-semibold">Add Lecturer</h1>
//             <UploadLecturers closeForm={closeForm} />
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default Lecturers;



import { useState, useEffect, useCallback } from "react";
import Header from "../Components/Header";
import Breadcrumb from "../Components/Breadcrumb";
import Footer from "../Components/Footer";
import axios from "../axiosConfig";
import UploadLecturers from "./UploadLecturer";
import DataTable from "../Components/DataTable"; 

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [lecturerDetails, setLecturerDetails] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);  // New state for the popup visibility

  const token = localStorage.getItem("auth-token");

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openPopup = () => setPopupOpen(true);  // Function to open the popup
  const closePopup = () => setPopupOpen(false);  // Function to close the popup

  const fetchLecturers = useCallback(async () => {
    setLoading(true);
    try {
      const departmentId = localStorage.getItem("departmentId");
      if (!departmentId) {
        // If no department ID, fetch all lecturers
        const response = await axios.get(`/lecturer/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.status !== 200) {
          throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
        }
        
        setLecturers(response.data);
        console.log('Fetched lecturers:', response.data);
      } else {
        // Fetch lecturers by department
        const response = await axios.get(`/lecturer/by-department/${departmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched lecturers by department:', response.data);
        
        if (response.status !== 200) {
          throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
        }
        
        setLecturers(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      setError(error.message || "Could not fetch lecturers. Please try again later.");
      setLoading(false);
    }
  }, [token]);
  

  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  const handleRowClick = (lecturer) => {
    setLecturerDetails(lecturer);
    openPopup(); // Open the popup when a row is clicked
  };

  const handleUploadSuccess = (newLecturers) => {
    setLecturers(prevLecturers => [...prevLecturers, ...newLecturers]);
    closeForm();
  };

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[{ label: "Home", link: "/" }, { label: "Lecturers", link: "/lecturers" }]} />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <button
            onClick={openForm}
            className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px]"
            aria-label="Add Lecturer"
          >
            Add Lecturer +
          </button>
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : lecturers.length > 0 ? (
            <DataTable 
              data={lecturers} 
              onRowClick={handleRowClick}
              onEdit={(lecturer) => {
                setLecturerDetails(lecturer);
                openForm();
              }}
              onDelete={() => {
                // Refresh the data after deletion
                fetchLecturers();
              }}
            />
          ) : (
            <div className="text-center text-gray-500">No lecturers available.</div>
          )}
        </div>
      </div>

      {/* Lecturer Details Popup */}
      {popupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closePopup}>
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Lecturer Details</h1>
            <div className="my-4">
              <p><strong>Name:</strong> {lecturerDetails.name || "N/A"}</p>
              <p><strong>Email:</strong> {lecturerDetails.email || "N/A"}</p>
              <p><strong>Phone:</strong> {lecturerDetails.phoneNumber || "N/A"}</p>
              <p><strong>UserName:</strong> {lecturerDetails.username || "N/A"}</p>
              <p><strong>Password:</strong> {lecturerDetails.password || "N/A"}</p>
            </div>
            <button
              onClick={closePopup}
              className="bg-blue-950 text-white font-semibold py-2 px-4 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Lecturer Form Popup */}
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Add Lecturer</h1>
            <UploadLecturers closeForm={closeForm} onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Lecturers;
