import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const AddStudents = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    studentId: 0,
    studentName: '',
    studentRegisterNumber: '',
    studentEmail: ''
  });

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await fetch('http://13.203.223.91:8084/api/Students');
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      } else {
        console.error('Error fetching students:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleFile = (e) => {
    const fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        setExcelFile(selectedFile);
      } else {
        setTypeError('Please select only Excel or CSV file types');
        setExcelFile(null);
      }
    } else {
      console.log('Please select your file');
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const formData = new FormData();
      formData.append('file', excelFile);

      try {
        const response = await fetch('http://13.203.223.91:8084/api/Students/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('File uploaded successfully');
          setIsModalOpen(false); // Close modal after success
          fetchStudentData(); // Refresh student data
        } else {
          alert('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    } else {
      alert('Please select a file first');
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      { StudentId: '', StudentName: '', StudentRegisterNumber: '', StudentEmail: '' },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download student details as Excel
  const downloadStudentDetails = () => {
    const worksheet = XLSX.utils.json_to_sheet(studentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_details.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View student details
  const handleViewStudent = async (studentId) => {
    try {
      const response = await fetch(`http://13.203.223.91:8084/api/Students/${studentId}`);
      if (response.ok) {
        const student = await response.json();
        alert(`Details:\nName: ${student.studentName}\nRegister Number: ${student.studentRegisterNumber}\nEmail: ${student.studentEmail}`);
      } else {
        console.error('Error fetching student details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Open the edit modal
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  // Submit the edited student data
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedStudent) {
      try {
        const response = await fetch('http://13.203.223.91:8084/api/Students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedStudent),
        });

        if (response.ok) {
          alert('Student updated successfully');
          setIsEditModalOpen(false);
          fetchStudentData(); // Refresh student data
        } else {
          alert('Failed to update student');
        }
      } catch (error) {
        console.error('Error updating student:', error);
        alert('Error updating student');
      }
    }
  };

  // Delete a student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`http://13.203.223.91:8084/api/Students/${studentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Student deleted successfully');
          fetchStudentData(); // Refresh student data
        } else {
          alert('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col items-center p-8">
        <div className="bg-white p-10 max-w-5xl w-full mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl text-blue-950 font-bold">Students</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-950 text-white px-4 py-2 rounded-lg">
                Add Student
              </button>
              <button 
                onClick={downloadStudentDetails} 
                className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Download Student Details
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {studentData.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    {/* <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentId</th> */}
                    <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentRegisterNumber</th>
                    <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentName</th>        
                    <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentEmail</th>
                    <th className="py-2 px-4 text-blue-950 font-semibold border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, index) => (
                    <tr key={index} className="even:bg-gray-100">
                      {/* <td className="py-2 px-4 border-b">{student.studentId}</td> */}
                      <td className="py-2 px-4 border-b">{student.studentRegisterNumber}</td>
                      <td className="py-2 px-4 border-b">{student.studentName}</td>
                      <td className="py-2 px-4 border-b">{student.studentEmail}</td>
                      <td className="py-2 px-4 border-b space-x-2">
                        <button 
                          onClick={() => handleViewStudent(student.studentId)} 
                          className="bg-green-500 text-white px-2 py-1 rounded">
                          View
                        </button>
                        <button 
                          onClick={() => handleEditStudent(student)} 
                          className="bg-yellow-500 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.studentId)} 
                          className="bg-red-500 text-white px-2 py-1 rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">No student data available yet!</p>
            )}
          </div>
        </div>

        
         {/* Modal for Adding Student */}
          {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold text-blue-950 mb-4">Add Student</h3>
              
              <form onSubmit={handleFileSubmit} className="mb-4">
                <div className="mb-4">
                  <label htmlFor="fileUpload" className="block font-semibold text-blue-950 mb-2">
                    Upload Excel or CSV File
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg p-2"
                    required
                    onChange={handleFile}
                  />
                  {typeError && <p className="mt-2 text-sm text-red-600">{typeError}</p>}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-blue-950 px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-950 text-white px-4 py-2 rounded-lg">
                    Upload
                  </button>
                </div>
              </form>

              <button 
                onClick={downloadTemplate} 
                className="w-full text-blue-950 bg-white border-2 border-blue-950 px-6 py-2 rounded-lg transition-colors">
                Download Template
              </button>
            </div>
          </div>
        )}


        {/* Modal for Editing Student */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Edit Student</h2>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="hidden"
                  value={selectedStudent.studentId}
                />
                <div>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedStudent.studentName}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, studentName: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Register Number</label>
                  <input
                    type="text"
                    value={selectedStudent.studentRegisterNumber}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, studentRegisterNumber: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedStudent.studentEmail}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, studentEmail: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AddStudents;
