import React, { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import DegreeProgramCreation from './DegreeProgramCreation';
import edit from '../../assets/img/edit.svg';
import deleteIcon from '../../assets/img/delete.svg';
import axios from '../../axiosConfig';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


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

  const filteredDepartments = departments.filter((department) =>
    department.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDelete = async (departmentId) => {
    try {
      const token = localStorage.getItem('auth-token');
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
        const token = localStorage.getItem('auth-token');
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
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
        const token = localStorage.getItem('auth-token');
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
          setDepartments(response.data);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb
        breadcrumb={[
          { label: 'Degree Programs', link: '/departments' },
        ]}
      />
      <div className="flex-grow px-4 sm:px-6 lg:px-20 font-poppins justify-center md:mr-[20%] md:ml-[10%]">
        <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-200 rounded-full w-full md:max-w-[471px] h-[41px] px-4 text-sm md:text-md"
          />
          {userRole === 'ROLE_AR' && (
            <div>
              <button
                onClick={openForm}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-full md:w-[144px] h-[41px]"
                aria-label="Add Degree Program"
              >
                + Degree
              </button>
              {formOpen && <DegreeProgramCreation closeForm={closeForm} addDepartment={addDepartment} />}
            </div>
          )}
        </div>

        <div className="mt-10">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <div
                key={department.id}
                className="bg-white flex md:w-full justify-between items-center gap-2"
              >
                <Link
                  to={`/departments/${department.id}/intakes`}
                  className="flex-1"
                  onClick={() => {
                    localStorage.setItem('departmentId', department.id);
                    localStorage.setItem('departmentName', department.departmentName);
                  }}
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-md mb-3 cursor-pointer flex justify-between items-center">
                    <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis w-0 flex-1">
                      {department.departmentName}
                    </span>
                  </div>
                </Link>

                {userRole === 'ROLE_AR' && (
                  <div className="flex flex-row gap-2">
                    <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-md mb-3 flex items-center justify-center">
                      <button
                        onClick={() => openEditForm(department)}
                        className="text-yellow-500 hover:text-yellow-700"
                        aria-label="Edit Degree"
                      >
                        <img src={edit} alt="edit" />
                      </button>
                    </div>
                    <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-md mb-3 flex items-center justify-center">
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
            className="w-[90%] max-w-[600px] p-6 sm:p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold mb-4">Edit Department</h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-4">
                <label htmlFor="departmentName" className="block mb-1 text-blue-950 text-md font-semibold">
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
              <div className="mb-6">
                <label htmlFor="departmentCode" className="block mb-1 text-blue-950 text-md font-semibold">
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
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="w-full sm:w-[150px] text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-[150px] py-2 px-4 bg-blue-950 text-white rounded-lg"
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
