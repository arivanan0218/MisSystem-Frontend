import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "../../../axiosConfig";

const UploadStudent = ({ closeForm, onUploadSuccess }) => {
  const [fileData, setFileData] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [intakeId, setIntakeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Transform the data to match API requirements
      const updatedData = jsonData.map((row) => {
        // Split name into firstName and lastName if it contains space
        const nameParts = (row.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
          departmentId: Number(departmentId) || 0,
          intakeId: Number(intakeId) || 0,
          studentRegNo: row.regNo || "",
          firstName: firstName,
          lastName: lastName,
          studentNIC: row.nic || "",
          studentMail: row.email || "",
          phoneNumber: row.phoneNumber || "",
          username: row.username || "",
          password: row.password || "",
          gender: row.gender || "Not Specified", // Default value
          dateOfBirth: row.dateOfBirth || new Date().toISOString().split('T')[0] // Using current date as default
        };
      });

      setFileData(updatedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await axios.post("/student/create-list", fileData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add authentication token
        },
      });
      
      alert("Student data uploaded successfully!");
      closeForm();
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error("Error uploading data:", error.response?.data || error.message);
      alert(`Error uploading data: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ["departmentId", "intakeId", "regNo", "name", "nic", "email", "phoneNumber", "username", "password", "gender", "dateOfBirth"],
      [
        departmentId || "{departmentId}", 
        intakeId || "{intakeId}", 
        "EG/xxxx/yyyy", 
        "John Doe", 
        "200123245624", 
        "johndoe@example.com", 
        "123456789", 
        "john", 
        "123456789", 
        "Male", 
        "2000-01-01"
      ],
      [
        departmentId || "{departmentId}", 
        intakeId || "{intakeId}", 
        "EG/xxxx/yyyy", 
        "Jane Smith", 
        "200123245623", 
        "janesmith@example.com", 
        "987456123", 
        "jane", 
        "123456789", 
        "Female", 
        "2000-02-15"
      ],
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Department ID</th>
                  <th className="border p-2">Intake ID</th>
                  <th className="border p-2">Registration No.</th>
                  <th className="border p-2">First Name</th>
                  <th className="border p-2">Last Name</th>
                  <th className="border p-2">NIC</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone Number</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Password</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {fileData.map((row, index) => (
                  <tr key={index}>
                    <td className="border p-2">{row.departmentId}</td>
                    <td className="border p-2">{row.intakeId}</td>
                    <td className="border p-2">{row.studentRegNo}</td>
                    <td className="border p-2">{row.firstName}</td>
                    <td className="border p-2">{row.lastName}</td>
                    <td className="border p-2">{row.studentNIC}</td>
                    <td className="border p-2">{row.studentMail}</td>
                    <td className="border p-2">{row.phoneNumber}</td>
                    <td className="border p-2">{row.username}</td>
                    <td className="border p-2">{row.password}</td>
                    <td className="border p-2">{row.gender}</td>
                    <td className="border p-2">{row.dateOfBirth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          disabled={fileData.length === 0 || isSubmitting}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default UploadStudent;