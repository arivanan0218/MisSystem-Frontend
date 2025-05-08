import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "../axiosConfig";

const UploadStudent = ({ closeForm, onUploadSuccess }) => {
  const [fileData, setFileData] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [intakeId, setIntakeId] = useState("");

  useEffect(() => {
    setDepartmentId(localStorage.getItem("departmentId") || "");
    setIntakeId(localStorage.getItem("intakeId") || "");
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const updatedData = jsonData.map((row) => ({
        ...row,
        departmentId,
        intakeId,
      }));

      setFileData(updatedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/student/create-list", fileData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Student data uploaded successfully!");
      closeForm();
      onUploadSuccess(response.data);
    } catch (error) {
      console.error(error);
      alert("Error uploading data. Please try again.");
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ["departmentId","intakeId","regNo", "name","nic" ,"email", "phoneNumber", "username", "password"],
      ["{departmentId}","{intakeId}","EG/xxxx/yyyy","Dr. John Doe", "200123245624", "johndoe@example.com", "123456789", "john", "123456789"],
      ["{departmentId}","{intakeId}","EG/xxxx/yyyy","Prof. Jane Smith","200123245623" ,"janesmith@example.com", "987456123", "jane", "123456789"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "StudentsUploadTemplate.xlsx");
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Upload Students List</h2>

      <button
        onClick={handleDownloadTemplate}
        className="mb-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
      >
        Download Excel Template
      </button>

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {fileData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Preview Data:</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <td className="border p-2 text-left">Department ID</td>
                <td className="border p-2 text-left">Intake ID</td>
                <th className="border p-2">Registration No.</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">NIC</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone Number</th>
                <th className="border p-2">Username</th>
                <th className="border p-2">Password</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, index) => (
                <tr key={index}>
                  <td className="border p-2 text-left">{row.departmentId}</td>
                  <td className="border p-2 text-left">{row.intakeId}</td>
                  <td className="border p-2">{row.regNo}</td>
                  <td className="border p-2">{row.name}</td>
                  <td className="border p-2">{row.nic}</td>
                  <td className="border p-2">{row.email}</td>
                  <td className="border p-2">{row.phoneNumber}</td>
                  <td className="border p-2">{row.username}</td>
                  <td className="border p-2">{row.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default UploadStudent;