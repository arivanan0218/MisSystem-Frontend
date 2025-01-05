import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import SemesterCreation from '../Components/SemesterCreation';
import axios from '../axiosConfig'; // Import axios for HTTP requests

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('auth-token');
  const intakeId = localStorage.getItem('intakeId'); // Get intakeId from localStorage

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const addSemester = (newSemester) => {
    setSemesters((prevSemesters) => {
      return Array.isArray(prevSemesters) ? [...prevSemesters, newSemester] : [newSemester];
    });
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
      <Breadcrumb />
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
              <Link 
              to={`/departments/${semester.id}/intakes/semesters/modules`} 
              key={semester.id}
              onClick={() => localStorage.setItem('semesterId', semester.id)}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  <div>{semester.semesterName || 'Unnamed Semester'}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No semesters available.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Semesters;
