import { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import axios from "../../axiosConfig";
import UploadStudents from "./Component/UploadStudent";
import DataTable from "./Component/StudentDataTable"; 

//testing
const Students = () => {
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false); // New state for the popup visibility

  const token = localStorage.getItem("auth-token");

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const intakeId = localStorage.getItem('intakeId');
  const departmentId = localStorage.getItem('departmentId'); 

  const openPopup = () => setPopupOpen(true); // Function to open the popup
  const closePopup = () => setPopupOpen(false); // Function to close the popup

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      if (!intakeId || !departmentId) {
        setError('Required data missing from localStorage.');
        return;
      }

      const response = await axios.get(`/student/sintake/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }

      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Could not fetch students. Please try again later.");
      setLoading(false);
    }
  }, [intakeId, departmentId,token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleRowClick = (student) => {
    setStudentDetails(student);
    openPopup(); // Open the popup when a row is clicked
  };

  const handleUploadSuccess = (newStudents) => {
    setStudents(prevStudents => [...prevStudents, ...newStudents]);
    closeForm();
    window.location.reload(); // Reload the page to reflect changes
  };

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[
        { label: 'Student Departments', link: `/studentdepartment` },
        { label: 'Student Intakes', link: `/studentdepartments/${departmentId}/sintakes` },
        { label: 'Students', link: '/students' },
      ]} 
      />
      
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <button
            onClick={openForm}
            className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px]"
            aria-label="Add Student"
          >
            Add Student +
          </button>
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : students.length > 0 ? (
            <DataTable data={students} onRowClick={handleRowClick} />
          ) : (
            <div className="text-center text-gray-500">No students available.</div>
          )}
        </div>
      </div>

      {/* Student Details Popup */}
      {popupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closePopup}>
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Student Details</h1>
            <div className="my-4">
            <p><strong>Registration No.:</strong> {studentDetails.studentRegNo || "N/A"}</p>
              <p><strong>Name:</strong> {studentDetails.firstName} {studentDetails.lastName}</p>
              <p><strong>NIC:</strong> {studentDetails.studentNIC || "N/A"}</p>
              <p><strong>Email:</strong> {studentDetails.studentMail || "N/A"}</p>
              <p><strong>Phone:</strong> {studentDetails.phoneNumber || "N/A"}</p>
              <p><strong>Username:</strong> {studentDetails.username || "N/A"}</p>
              <p><strong>Password:</strong> {studentDetails.password || "N/A"}</p>
              <p><strong>Gender:</strong> {studentDetails.gender || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {studentDetails.dateOfBirth || "N/A"}</p>
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

      {/* Add Student Form Popup */}
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Add Student</h1>
            <UploadStudents closeForm={closeForm} onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Students;
