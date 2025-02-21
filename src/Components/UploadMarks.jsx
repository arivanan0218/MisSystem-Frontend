import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "../axiosConfig";

const UploadMarks = ({ closeForm }) => {
  const [fileData, setFileData] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Fetch students and assignments on component mount
  useEffect(() => {
    const fetchStudentsAndAssignments = async () => {
      try {
        const studentsResponse = await axios.get("/student/");
        const assignmentsResponse = await axios.get("/assignment/");
        setStudents(studentsResponse.data);
        setAssignments(assignmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching student or assignment data. Please try again.");
      }
    };

    fetchStudentsAndAssignments();
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

      // Map the uploaded data to include studentId and assignmentId
      const updatedData = jsonData.map((row) => {
        const student = students.find((s) => s.student_Reg_No === row.student_Reg_No);
        const assignment = assignments.find((a) => a.assignmentName === row.assignmentName);

        return {
          studentId: student ? student.id : null,
          assignmentId: assignment ? assignment.id : null,
          marksObtained: row.marksObtained,
          student_Reg_No: row.student_Reg_No,
          assignmentName: row.assignmentName,
        };
      });

      setFileData(updatedData);
    };
    reader.readAsBinaryString(file);
  };

  // Submit the data to the backend
  const handleSubmit = async () => {
    try {
      // Filter out rows with missing studentId or assignmentId
      const validData = fileData.filter(
        (row) => row.studentId !== null && row.assignmentId !== null
      );

      if (validData.length === 0) {
        alert("No valid data to upload. Please check the file.");
        return;
      }

      const response = await axios.post("/marks/create-list", validData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Data uploaded successfully!");
        closeForm();
      } else {
        alert("Error uploading data. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(`Error uploading data: ${error.message}`);
    }
  };

  // Download the template
  const handleDownloadTemplate = () => {
    const templateData = [
      ["student_Reg_No", "assignmentName", "marksObtained"], // Updated headers
      ["REG001", "CA01", 85.5], // Example row
      ["REG002", "CA02", 78.0], // Example row
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
          background: "#1e3a8a",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download Excel Template
      </button>

      {/* File upload section */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />

      {/* Preview Data */}
      {fileData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview Data:</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Student Reg No</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Assignment Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.student_Reg_No}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.assignmentName}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.marksObtained}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Button placed near Cancel Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <button
          onClick={closeForm}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#ffffff",
            color: "#1e3a8a",
            border: "2px solid #1e3a8a",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={fileData.length === 0}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#1e3a8a",
            color: "#fff",
            border: "2px solid #1e3a8a",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadMarks;