import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import SemesterCreation from '../Components/SemesterCreation';

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const { degreename } = useParams(); // Get degree name from URL

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
        const response = await fetch('https://localhost:7276/api/Semester');
        if (!response.ok) {
          throw new Error('Failed to fetch semesters');
        }
        const data = await response.json();

        // Log the API response for debugging
        console.log('API Response:', data);

        // Check if the response contains the semesters in the `result` field
        if (data.success && Array.isArray(data.result)) {
          console.log('Fetched semesters:', data.result); // Log fetched data for debugging

          // No filtering is necessary here based on degreeName, adjust according to the API structure
          setSemesters(data.result);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setError('Could not fetch semesters. Please try again later.');
      }
    };

    fetchSemesters();
  }, []);

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
              <Link to={`/departments/${semester.semesterId}/intakes/semesters/modules`} key={semester.semesterId}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  {/* Handle cases where semesterName might be null */}
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
