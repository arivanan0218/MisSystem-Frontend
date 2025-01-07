import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import SemesterCreation from '../Components/SemesterCreation';
import axios from '../axiosConfig'; // Import axios for HTTP requests
import edit from '../assets/img/edit.svg';
import deleteIcon from '../assets/img/delete.svg';

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);

  const token = localStorage.getItem('auth-token');
  const departmentId = localStorage.getItem('departmentId'); 
  const intakeId = localStorage.getItem('intakeId'); // Get intakeId from localStorage

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (semester) => {
    setEditingSemester(semester);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingSemester(null);
    setEditFormOpen(false);
  };

  const addSemester = (newSemester) => {
    setSemesters((prevSemesters) => {
      return Array.isArray(prevSemesters) ? [...prevSemesters, newSemester] : [newSemester];
    });
  };

  const handleDelete = async (semesterId) => {
    try {
      const response = await axios.delete(`/semester/${semesterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSemesters((prevSemesters) =>
          prevSemesters.filter((semester) => semester.id !== semesterId)
        );
      } else {
        throw new Error('Failed to delete semester');
      }
    } catch (err) {
      console.error('Error deleting semester:', err);
      setError('Could not delete semester. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { semesterName, semesterYear, semesterDuration } = editingSemester;

    if (semesterName.trim() && semesterYear.trim() && semesterDuration.trim()) {
      try {
        const response = await axios.put(
          `/semester/${editingSemester.id}`, 
          {
            semesterName,
            semesterYear,
            semesterDuration,
            intakeId: editingSemester.intakeId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedSemester = response.data;

        setSemesters((prevSemesters) =>
          prevSemesters.map((semester) =>
            semester.id === updatedSemester.id ? updatedSemester : semester
          )
        );

        closeEditForm();
      } catch (error) {
        console.error('Error updating semester:', error);
        setError('Failed to update semester. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(`/semester/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch semesters: ${response.statusText}`);
        }

        const data = response.data;
        console.log('Fetched semesters:', data); // Log fetched data for debugging

        // Filter semesters to match the current intakeId
        const filteredSemesters = data.filter(
          (semester) => semester.intakeId === parseInt(intakeId, 10)
        );

        if (Array.isArray(filteredSemesters)) {
          setSemesters(filteredSemesters); // Set filtered semesters
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setError('Could not fetch semesters. Please try again later.');
      }
    };

    if (intakeId) {
      fetchSemesters();
    } else {
      setError('No intake ID found in localStorage.');
    }
  }, [intakeId]); // Run when intakeId changes

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[
         { label: 'Home', link: '/departments' },
         { label: 'Degree Programs', link: `/departments` },
         { label: 'Intakes', link: `/departments/${departmentId}/intakes` },// Correct path with intakeName
        { label: 'Semesters', link: `/departments/${departmentId}/intakes/${intakeId}/semesters` } // Correct path with intakeName
      ]} />
      <div className='mr-[20%] ml-[10%] px-8 font-poppins'>
        <div className='py-8 flex items-center justify-between'>
          <input
            type="text"
            placeholder='Search'
            className='bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md'
          />
          <div>
            <button 
              onClick={openForm} 
              className='bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4'
              aria-label="Add Semester"
            >
              Add Semester +
            </button>
            {formOpen && <SemesterCreation closeForm={closeForm} addSemester={addSemester} />}
          </div>
        </div>

        <div className='mt-[80px]'>
          {error && (
            <div className='text-center text-red-500 mb-4'>{error}</div>
          )}
          {semesters.length > 0 ? (
            semesters.map((semester) => (
              <div key={semester.id} className="bg-white flex justify-between items-center">
                <Link 
                  to={`/departments/${semester.id}/intakes/semesters/modules`} 
                  className="flex-1"
                  onClick={() => localStorage.setItem('semesterId', semester.id)}
                >
                  <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center'>
                    {semester.semesterName || 'Unnamed Semester'}
                  </div>
                </Link>
                <div className="flex space-x-2">
                  {/* <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => openEditForm(semester)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label="Edit Semester"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div> */}
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(semester.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Semester"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No semesters available.
            </div>
          )}
        </div>
      </div>
      <Footer />
      {editFormOpen && (
        <SemesterCreation
          closeForm={closeEditForm}
          addSemester={addSemester}
          isEditing={true}
          currentSemester={editingSemester}
        />
      )}
    </div>
  );
};

export default Semesters;
