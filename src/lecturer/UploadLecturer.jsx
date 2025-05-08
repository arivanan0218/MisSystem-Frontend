// import { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import axios from "../axiosConfig";

// const UploadLecturers = ({ closeForm, onUploadSuccess }) => {
//   const [fileData, setFileData] = useState([]);
//   const [departmentId, setDepartmentId] = useState("");

//   useEffect(() => {
//     setDepartmentId(localStorage.getItem("departmentId") || "");
//   }, []);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);

//       const updatedData = jsonData.map((row) => ({
//         ...row,
//         departmentId,
//       }));

//       setFileData(updatedData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post("/lecturer/create-list", fileData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       alert("Lecturer data uploaded successfully!");
//       closeForm();
//       onUploadSuccess(response.data);
//     } catch (error) {
//       console.error(error);
//       alert("Error uploading data. Please try again.");
//     }
//   };

//   const handleDownloadTemplate = () => {
//     const templateData = [
//       ["name", "email", "phoneNumber" , "username" ,"password"],
//       ["Dr. John Doe", "johndoe@example.com", "123456789","john", "123456789" ],
//       ["Prof. Jane Smith", "janesmith@example.com",  "987456123","jane", "123456789"],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(templateData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
//     XLSX.writeFile(workbook, "LecturersUploadTemplate.xlsx");
//   };

//   return (
//     <div className="p-5">
//       <h2 className="text-2xl font-bold mb-4">Upload Lecturers List</h2>

//       <button
//         onClick={handleDownloadTemplate}
//         className="mb-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
//       >
//         Download Excel Template
//       </button>

//       <input
//         type="file"
//         accept=".xlsx, .xls, .csv"
//         onChange={handleFileUpload}
//         className="mb-4"
//       />

//       {fileData.length > 0 && (
//         <div className="mt-4">
//           <h3 className="text-xl font-semibold mb-2">Preview Data:</h3>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2">Name</th>
//                 <th className="border p-2">Email</th>
//                 <th className="border p-2">Phone Number</th>
//                 <th className="border p-2">Username</th>
//                 <th className="border p-2">Password</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fileData.map((row, index) => (
//                 <tr key={index}>
//                   <td className="border p-2">{row.name}</td>
//                   <td className="border p-2">{row.email}</td>
//                   <td className="border p-2">{row.phoneNumber}</td>
//                   <td className="border p-2">{row.username}</td>
//                   <td className="border p-2">{row.password}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div className="flex justify-end mt-4">
//         <button
//           onClick={closeForm}
//           className="px-4 py-2 bg-white text-blue-900 border-2 border-blue-900 rounded mr-2 hover:bg-blue-100"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSubmit}
//           disabled={fileData.length === 0}
//           className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:bg-gray-400"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadLecturers;



import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "../axiosConfig";

const UploadLecturers = ({ closeForm, onUploadSuccess }) => {
  const [fileData, setFileData] = useState([]);
  const [departmentId, setDepartmentId] = useState("");

  // Load departmentId from localStorage
  useEffect(() => {
    setDepartmentId(localStorage.getItem("departmentId") || "");
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // ✅ Add departmentId to each row
      const updatedData = jsonData.map((row) => ({
        ...row,
        departmentId,
      }));

      setFileData(updatedData);
    };
    reader.readAsBinaryString(file);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/lecturer/create-list", fileData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Lecturer data uploaded successfully!");
      closeForm();
      onUploadSuccess(response.data); // ✅ Fixed response handling
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.response?.data?.message || "Failed to upload data"}`); // ✅ Show detailed error
    }
  };

  // Download Excel template
  const handleDownloadTemplate = () => {
    const templateData = [
      ["departmentId","name", "email", "phoneNumber", "username", "password"],
      ["{departmentId}","Dr. John Doe", "johndoe@example.com", "123456789", "john", "123456789"],
      ["{departmentId}","Prof. Jane Smith", "janesmith@example.com", "987456123", "jane", "123456789"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "LecturersUploadTemplate.xlsx");
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Upload Lecturers List</h2>

      {/* ✅ Download Template Button */}
      <button
        onClick={handleDownloadTemplate}
        className="mb-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
      >
        Download Excel Template
      </button>

      {/* ✅ File Input */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {/* ✅ Preview Table */}
      {fileData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Preview Data:</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <td className="border p-2 text-left">Department ID</td>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Phone Number</th>
                <th className="border p-2 text-left">Username</th>
                <th className="border p-2 text-left">Password</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, index) => (
                <tr key={index}>
                  <td className="border p-2 text-left">{row.departmentId}</td>
                  <td className="border p-2 text-left">{row.name}</td>
                  <td className="border p-2 text-left">{row.email}</td>
                  <td className="border p-2 text-left">{row.phoneNumber}</td>
                  <td className="border p-2 text-left">{row.username}</td>
                  <td className="border p-2 text-left">{row.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Form Buttons */}
      <div className="flex justify-end mt-4">
        <button
          onClick={closeForm}
          className="px-4 py-2 bg-white text-blue-900 border-2 border-blue-900 rounded mr-2 hover:bg-blue-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={fileData.length === 0}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:bg-gray-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadLecturers;
