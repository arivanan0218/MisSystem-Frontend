import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import DegreeProgramCreation from '../Components/DegreeProgramCreation';

const Departments = () => {
  const [degrees, setDegrees] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const addDegree = (newDegree) => {
    setDegrees((prevDegrees) => {
      return Array.isArray(prevDegrees) ? [...prevDegrees, newDegree] : [newDegree];
    });
  };

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch('https://localhost:7276/api/DegreeProgram');
        if (!response.ok) {
          throw new Error('Failed to fetch degrees');
        }
        const data = await response.json();
        
        // Check if the response contains the degrees in the `result` field
        if (data.success && Array.isArray(data.result)) {
          console.log('Fetched degrees:', data.result); // Log fetched data for debugging
          setDegrees(data.result); // Set degrees from the result array
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching degrees:', error);
        setError('Could not fetch degrees. Please try again later.');
      }
    };

    fetchDegrees();
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
              aria-label="Add Degree Program"
            >
              Add Degree +
            </button>
            {formOpen && <DegreeProgramCreation closeForm={closeForm} addDegree={addDegree} />}
          </div>
        </div>

        <div className='mt-[80px]'>
          {error && (
            <div className='text-center text-red-500 mb-4'>{error}</div>
          )}
          {degrees.length > 0 ? (
            degrees.map((degree) => (
              <Link to={`/departments/${degree.degreeName}/intakes`} key={degree.degreeProgramId}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  <div>{degree.degreeName}</div>
               
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No degrees available.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Departments;
