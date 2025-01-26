import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import DegreeProgramCreation from '../Components/DegreeProgramCreation';
import edit from '../assets/img/edit.svg';
import deleteIcon from '../assets/img/delete.svg';
import axios from '../axiosConfig'; // Use axios for API requests

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Get the user role from localStorage
  const userRole = localStorage.getItem('userRole');

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
        { label: 'Home', link: '/departments' }, 
        { label: 'Degree Programs', link: '/departments' }]} 
      />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {userRole === 'ROLE_AR' && (
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

          )}
          
        </div>

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

                {userRole === 'ROLE_AR' && (
                  <div className="flex space-x-2">
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
                </div>
                )}
                
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

export default Departments;
