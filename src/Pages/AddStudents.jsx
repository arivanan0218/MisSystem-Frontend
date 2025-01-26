// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import Header from '../Components/Header';
// import Footer from '../Components/Footer';

// const AddStudents = () => {
//   const [excelFile, setExcelFile] = useState(null);
//   const [typeError, setTypeError] = useState(null);
//   const [studentData, setStudentData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState({
//     studentId: 0,
//     studentName: '',
//     studentRegisterNumber: '',
//     studentEmail: ''
//   });

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const fetchStudentData = async () => {
//     try {
//       const response = await fetch('https://localhost:7276/api/Students');
//       if (response.ok) {
//         const data = await response.json();
//         setStudentData(data);
//       } else {
//         console.error('Error fetching students:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     }
//   };

//   const handleFile = (e) => {
//     const fileTypes = [
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'text/csv',
//     ];
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (fileTypes.includes(selectedFile.type)) {
//         setTypeError(null);
//         setExcelFile(selectedFile);
//       } else {
//         setTypeError('Please select only Excel or CSV file types');
//         setExcelFile(null);
//       }
//     } else {
//       console.log('Please select your file');
//     }
//   };

//   const handleFileSubmit = async (e) => {
//     e.preventDefault();
//     if (excelFile !== null) {
//       const formData = new FormData();
//       formData.append('file', excelFile);

//       try {
//         const response = await fetch('https://localhost:7276/api/Students/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         if (response.ok) {
//           alert('File uploaded successfully');
//           setIsModalOpen(false); // Close modal after success
//           fetchStudentData(); // Refresh student data
//         } else {
//           alert('Failed to upload file');
//         }
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         alert('Error uploading file');
//       }
//     } else {
//       alert('Please select a file first');
//     }
//   };

//   const downloadTemplate = () => {
//     const templateData = [
//       { StudentId: '', StudentName: '', StudentRegisterNumber: '', StudentEmail: '' },
//     ];
//     const worksheet = XLSX.utils.json_to_sheet(templateData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'student_template.xlsx');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Download student details as Excel
//   const downloadStudentDetails = () => {
//     const worksheet = XLSX.utils.json_to_sheet(studentData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'student_details.xlsx');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // View student details
//   const handleViewStudent = async (studentId) => {
//     try {
//       const response = await fetch(`https://localhost:7276/api/Students/${studentId}`);
//       if (response.ok) {
//         const student = await response.json();
//         alert(`Details:\nName: ${student.studentName}\nRegister Number: ${student.studentRegisterNumber}\nEmail: ${student.studentEmail}`);
//       } else {
//         console.error('Error fetching student details:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching student details:', error);
//     }
//   };

//   // Open the edit modal
//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setIsEditModalOpen(true);
//   };

//   // Submit the edited student data
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedStudent) {
//       try {
//         const response = await fetch('https://localhost:7276/api/Students', {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(selectedStudent),
//         });

//         if (response.ok) {
//           alert('Student updated successfully');
//           setIsEditModalOpen(false);
//           fetchStudentData(); // Refresh student data
//         } else {
//           alert('Failed to update student');
//         }
//       } catch (error) {
//         console.error('Error updating student:', error);
//         alert('Error updating student');
//       }
//     }
//   };

//   // Delete a student
//   const handleDeleteStudent = async (studentId) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       try {
//         const response = await fetch(`https://localhost:7276/api/Students/${studentId}`, {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           alert('Student deleted successfully');
//           fetchStudentData(); // Refresh student data
//         } else {
//           alert('Failed to delete student');
//         }
//       } catch (error) {
//         console.error('Error deleting student:', error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <div className="flex-grow flex flex-col items-center p-8">
//         <div className="bg-white p-10 max-w-5xl w-full mb-4">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl text-blue-950 font-bold">Students</h3>
//             <div className="flex space-x-2">
//               <button 
//                 onClick={() => setIsModalOpen(true)} 
//                 className="bg-blue-950 text-white px-4 py-2 rounded-lg">
//                 Add Student
//               </button>
//               <button 
//                 onClick={downloadStudentDetails} 
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg">
//                 Download Student Details
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             {studentData.length > 0 ? (
//               <table className="min-w-full bg-white border border-gray-300">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     {/* <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentId</th> */}
//                     <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentRegisterNumber</th>
//                     <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentName</th>        
//                     <th className="py-2 px-4 text-blue-950 font-semibold border-b">StudentEmail</th>
//                     <th className="py-2 px-4 text-blue-950 font-semibold border-b">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {studentData.map((student, index) => (
//                     <tr key={index} className="even:bg-gray-100">
//                       {/* <td className="py-2 px-4 border-b">{student.studentId}</td> */}
//                       <td className="py-2 px-4 border-b">{student.studentRegisterNumber}</td>
//                       <td className="py-2 px-4 border-b">{student.studentName}</td>
//                       <td className="py-2 px-4 border-b">{student.studentEmail}</td>
//                       <td className="py-2 px-4 border-b space-x-2">
//                         <button 
//                           onClick={() => handleViewStudent(student.studentId)} 
//                           className="bg-green-500 text-white px-2 py-1 rounded">
//                           View
//                         </button>
//                         <button 
//                           onClick={() => handleEditStudent(student)} 
//                           className="bg-yellow-500 text-white px-2 py-1 rounded">
//                           Edit
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteStudent(student.studentId)} 
//                           className="bg-red-500 text-white px-2 py-1 rounded">
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-center text-gray-600">No student data available yet!</p>
//             )}
//           </div>
//         </div>

        
//          {/* Modal for Adding Student */}
//           {isModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               <h3 className="text-xl font-bold text-blue-950 mb-4">Add Student</h3>
              
//               <form onSubmit={handleFileSubmit} className="mb-4">
//                 <div className="mb-4">
//                   <label htmlFor="fileUpload" className="block font-semibold text-blue-950 mb-2">
//                     Upload Excel or CSV File
//                   </label>
//                   <input
//                     type="file"
//                     id="fileUpload"
//                     className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg p-2"
//                     required
//                     onChange={handleFile}
//                   />
//                   {typeError && <p className="mt-2 text-sm text-red-600">{typeError}</p>}
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="bg-gray-200 text-blue-950 px-4 py-2 rounded-lg">
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-950 text-white px-4 py-2 rounded-lg">
//                     Upload
//                   </button>
//                 </div>
//               </form>

//               <button 
//                 onClick={downloadTemplate} 
//                 className="w-full text-blue-950 bg-white border-2 border-blue-950 px-6 py-2 rounded-lg transition-colors">
//                 Download Template
//               </button>
//             </div>
//           </div>
//         )}


//         {/* Modal for Editing Student */}
//         {isEditModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-5 rounded-lg shadow-lg">
//               <h2 className="text-lg font-bold mb-4">Edit Student</h2>
//               <form onSubmit={handleEditSubmit}>
//                 <input
//                   type="hidden"
//                   value={selectedStudent.studentId}
//                 />
//                 <div>
//                   <label className="block mb-2">Name</label>
//                   <input
//                     type="text"
//                     value={selectedStudent.studentName}
//                     onChange={(e) => setSelectedStudent({ ...selectedStudent, studentName: e.target.value })}
//                     className="border border-gray-300 p-2 rounded w-full"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2">Register Number</label>
//                   <input
//                     type="text"
//                     value={selectedStudent.studentRegisterNumber}
//                     onChange={(e) => setSelectedStudent({ ...selectedStudent, studentRegisterNumber: e.target.value })}
//                     className="border border-gray-300 p-2 rounded w-full"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2">Email</label>
//                   <input
//                     type="email"
//                     value={selectedStudent.studentEmail}
//                     onChange={(e) => setSelectedStudent({ ...selectedStudent, studentEmail: e.target.value })}
//                     className="border border-gray-300 p-2 rounded w-full"
//                     required
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-between">
//                   <button 
//                     type="button" 
//                     onClick={() => setIsEditModalOpen(false)} 
//                     className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
//                     Cancel
//                   </button>
//                   <button 
//                     type="submit" 
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//                     Save
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default AddStudents;



import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import DegreeProgramCreation from '../Components/DegreeProgramCreation';
import edit from '../assets/img/edit.svg';
import deleteIcon from '../assets/img/delete.svg';
import axios from '../axiosConfig'; // Use axios for API requests

const StudentDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (department) => {
    setEditingDepartment(department);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingDepartment(null);
    setEditFormOpen(false);
  };

  const addDepartment = (newDepartment) => {
    setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
  };

  const handleDelete = async (departmentId) => {
    try {
      const token = localStorage.getItem('auth-token'); // Retrieve auth-token
      if (!token) {
        console.error('No token found. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      const response = await axios.delete(`/department/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDepartments((prevDepartments) =>
          prevDepartments.filter((department) => department.id !== departmentId)
        );
      } else {
        throw new Error('Failed to delete department');
      }
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Could not delete department. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { departmentName, departmentCode } = editingDepartment;

    if (departmentName.trim() && departmentCode.trim()) {
      try {
        const token = localStorage.getItem('auth-token'); // Retrieve auth-token
        if (!token) {
          console.error('No token found. Redirecting to login.');
          window.location.href = '/login';
          return;
        }

        const response = await axios.put(`/department/${editingDepartment.id}`, {
          departmentName,
          departmentCode,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedDepartment = response.data;

        setDepartments((prevDepartments) =>
          prevDepartments.map((department) =>
            department.id === updatedDepartment.id ? updatedDepartment : department
          )
        );

        closeEditForm();
      } catch (error) {
        console.error('Error updating department:', error);
        setError('Failed to update department. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('auth-token'); // Retrieve auth-token
        if (!token) {
          console.error('No token found. Redirecting to login.');
          window.location.href = '/login';
          return;
        }

        const response = await axios.get('/department/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setDepartments(response.data); // Set the departments directly from the response
        } else {
          throw new Error('Failed to fetch departments');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Could not fetch departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        {/* <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          <div>
            <button
              onClick={openForm}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
              aria-label="Add Degree Program"
            >
              Add Degree +
            </button>
            {formOpen && <DegreeProgramCreation closeForm={closeForm} addDepartment={addDepartment} />}
          </div>
        </div> */}

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {departments.length > 0 ? (
            departments.map((department) => (
              <div key={department.id} className="bg-white flex justify-between items-center">
                <Link
                  to={`/departments/${department.id}/intakes`}
                  className="flex-1"
                  onClick={() => localStorage.setItem('departmentId', department.id)} // Save departmentId to localStorage
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {department.departmentName}
                  </div>
                </Link>
                {/* <div className="flex space-x-2">
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => openEditForm(department)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label="Edit Degree"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div>

                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Degree"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div> */}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No departments available.</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDepartment;
