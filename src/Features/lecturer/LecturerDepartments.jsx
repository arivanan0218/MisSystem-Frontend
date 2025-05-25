import { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import axios from '../../axiosConfig';

const LecturerDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  

  const closeEditForm = () => {
    setEditingDepartment(null);
    setEditFormOpen(false);
  };


  const filteredDepartments = departments.filter((department) =>
    department.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

        const response = await axios.put(
          `/department/${editingDepartment.id}`, 
          {
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
      <Breadcrumb breadcrumb={[
        { label: 'lecturer deparments', link: '/lecturersdepartments' }]} 
      />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
                  
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <div key={department.id} className="bg-white flex justify-between items-center">
                <Link
                  to={`/lecturerdepartments/${department.id}/lecturers`}
                  className="flex-1"
                  onClick={() => localStorage.setItem('departmentId', department.id)} // Save departmentId to localStorage
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {department.departmentName}
                  </div>
                </Link>

                
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No departments available.</div>
          )}
        </div>
      </div>

      {editFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeEditForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Edit Department</h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-6">
                <label htmlFor="departmentName" className="block mb-2 text-blue-950 text-lg font-semibold">
                  Department Name
                </label>
                <input
                  type="text"
                  id="departmentName"
                  value={editingDepartment?.departmentName || ''}
                  onChange={(e) =>
                    setEditingDepartment({ ...editingDepartment, departmentName: e.target.value })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="departmentCode" className="block mb-2 text-blue-950 text-lg font-semibold">
                  Department Code
                </label>
                <input
                  type="text"
                  id="departmentCode"
                  value={editingDepartment?.departmentCode || ''}
                  onChange={(e) =>
                    setEditingDepartment({ ...editingDepartment, departmentCode: e.target.value })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LecturerDepartments;
