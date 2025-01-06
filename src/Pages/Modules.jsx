import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import ModuleCreation from '../Components/ModuleCreation';
import axios from '../axiosConfig'; // Import axios for HTTP requests

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const semesterId = localStorage.getItem('semesterId'); 
  const departmentId = localStorage.getItem('departmentId'); 
  const intakeId = localStorage.getItem('intakeId'); // Get intakeId from localStorage

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const addModule = (newModule) => {
    setModules((prevModules) => {
      return Array.isArray(prevModules) ? [...prevModules, newModule] : [newModule];
    });
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('auth-token'); // Get the auth token
        const response = await axios.get(`/module/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch modules: ${response.statusText}`);
        }

        const data = response.data;
        console.log('Fetched modules:', data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setModules(data); // Set the modules directly
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('Could not fetch modules. Please try again later.');
      }
    };

    if (semesterId) {
      fetchModules();
    } else {
      setError('No semester ID found.');
    }
  }, [semesterId]);

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[
         { label: 'Home', link: '/departments' },
         { label: 'Degree Programs', link: `/departments` },
         { label: 'Intakes', link: `/departments/${departmentId}/intakes` },// Correct path with intakeName
        { label: 'Semesters', link: `/departments/${departmentId}/intakes/${intakeId}/semesters` }, // Correct path with intakeName
        { label: 'Modules', link: `/departments/${departmentId}/intakes/semesters/modules` }
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
              aria-label="Add Module"
            >
              Add Module +
            </button>
            {formOpen && <ModuleCreation closeForm={closeForm} addModule={addModule} />}
          </div>
        </div>

        <div className='mt-[80px]'>
          {error && (
            <div className='text-center text-red-500 mb-4'>{error}</div>
          )}
          {modules.length > 0 ? (
            modules.map((module) => (
              <Link to={`/modules/${module.moduleId}`} key={module.moduleId}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  <div>{module.moduleName || 'Unnamed Module'}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No modules available.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Modules;
