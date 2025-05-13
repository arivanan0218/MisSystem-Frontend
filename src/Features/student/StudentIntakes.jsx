

import { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import axios from '../../axiosConfig';  // Import the axios instance

const Intakes = () => {
  const [intakes, setIntakes] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingIntake, setEditingIntake] = useState(null);

  // Get departmentId from local storage
  const departmentId = localStorage.getItem('departmentId');  // Assuming departmentId is stored with key 'departmentId'

  // Get the user role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Check if departmentId exists in localStorage
  if (!departmentId) {
    console.error('Department ID not found in localStorage');
    setError('Department ID is missing. Please login again.');
    return null;  // Optionally return null or show an error message
  }

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (intake) => {
    setEditingIntake(intake);
    setEditFormOpen(true);
  };

  const closeEditForm = () => {
    setEditingIntake(null);
    setEditFormOpen(false);
  };



  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        const response = await axios.get(`/intake/department/${departmentId}`);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch intakes: ${response.statusText}`);
        }

        const data = response.data;
        console.log('Fetched intakes:', data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setIntakes(data); // Set the intakes directly from the response
        } else {
          throw new Error('Unexpected data structure from API');
        }
      } catch (err) {
        console.error('Error fetching intakes:', err);
        setError('Could not fetch intakes. Please try again later.');
      }
    };

    if (departmentId) {
      fetchIntakes();
    }

  }, [departmentId]);  // Dependency on departmentId

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[
        { label: 'Home', link: '/departments' },
        { label: 'Student Departments', link: `/studentdepartment` },
        { label: 'Student Intakes', link: `/studentdepartment/${departmentId}/sintakes` }
      ]} />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {/* {userRole === 'ROLE_AR' && (
            <div>
            <button
              onClick={openForm}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
              aria-label="Add Intake"
            >
              Add Intake +
            </button>
            {formOpen && <IntakeCreation closeForm={closeForm} addIntake={addIntake} />}
          </div>
          )} */}
          
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {intakes.length > 0 ? (
            intakes.map((intake) => (
              <div key={intake.id} className="bg-white flex justify-between items-center">
                    <Link to={`${intake.id}/students`} 
                    className="flex-1"
                    onClick={() => localStorage.setItem('intakeId', intake.id)} // Save departmentId to localStorage
                    >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {intake.intakeYear} - {intake.batch}
                  </div>
                </Link>
               
                
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No intakes available.</div>
          )}
        </div>
      </div>

      

      <Footer />
    </div>
  );
};

export default Intakes;
