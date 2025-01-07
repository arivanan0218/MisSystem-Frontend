import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "../axiosConfig";

const UploadMarks = () => {
  const [fileData, setFileData] = useState([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [intakeId, setIntakeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  // Get the values from localStorage and set them as default
  useEffect(() => {
    setAssignmentId(localStorage.getItem("assignmentId") || "");
    setModuleId(localStorage.getItem("moduleId") || "");
    setSemesterId(localStorage.getItem("semesterId") || "");
    setIntakeId(localStorage.getItem("intakeId") || "");
    setDepartmentId(localStorage.getItem("departmentId") || "");
  }, []);

  // Handle file upload
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

      // Add the input values to each row
      const updatedData = jsonData.map((row) => ({
        ...row,
        assignmentId,
        moduleId,
        semesterId,
        intakeId,
        departmentId,
      }));

      setFileData(updatedData);
    };
    reader.readAsBinaryString(file);
  };

  // Submit the data to the backend
  const handleSubmit = async () => {
    try {
      await axios.post("/marks/create-list", fileData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Data uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Error uploading data. Please try again.");
    }
  };

  // Download the template
  const handleDownloadTemplate = () => {
    const templateData = [
      ["registerNo", "studentName", "obtainedMarks"], // Headers
      ["REG001", "John Doe", 85.5], // Example row
      ["REG002", "Jane Smith", 78.0], // Example row
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "MarksUploadTemplate.xlsx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Marks List</h2>

      {/* Button to download the template */}
      <button
        onClick={handleDownloadTemplate}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download Excel Template
      </button>

      {/* Inputs for IDs */}
      <div>
        <label>Assignment ID:</label>
        <input
          type="text"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          placeholder="Enter Assignment ID"
        />
      </div>
      <div>
        <label>Module ID:</label>
        <input
          type="text"
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          placeholder="Enter Module ID"
        />
      </div>
      <div>
        <label>Semester ID:</label>
        <input
          type="text"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          placeholder="Enter Semester ID"
        />
      </div>
      <div>
        <label>Intake ID:</label>
        <input
          type="text"
          value={intakeId}
          onChange={(e) => setIntakeId(e.target.value)}
          placeholder="Enter Intake ID"
        />
      </div>
      <div>
        <label>Department ID:</label>
        <input
          type="text"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          placeholder="Enter Department ID"
        />
      </div>

      {/* File upload section */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />
      <button
        onClick={handleSubmit}
        disabled={fileData.length === 0}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      {/* Preview data */}
      <h3>Preview Data:</h3>
      {fileData.length > 0 && (
        <table
          border="1"
          style={{ marginTop: "10px", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              {Object.keys(fileData[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fileData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UploadMarks;
