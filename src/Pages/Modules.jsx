import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import ModuleCreation from '../Components/ModuleCreation';
import axios from '../axiosConfig'; // Import axios for HTTP requests
import edit from '../assets/img/edit.svg';
import deleteIcon from '../assets/img/delete.svg';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const semesterId = localStorage.getItem('semesterId'); 
  const departmentId = localStorage.getItem('departmentId'); 
  const intakeId = localStorage.getItem('intakeId'); // Get intakeId from localStorage

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (module) => {
    setEditingModule(module);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingModule(null);
    setEditFormOpen(false);
  };

  const addModule = (newModule) => {
    setModules((prevModules) => {
      return Array.isArray(prevModules) ? [...prevModules, newModule] : [newModule];
    });
  };

  const handleDelete = async (moduleId) => {
    try {
      const token = localStorage.getItem('auth-token'); // Retrieve auth-token
      if (!token) {
        console.error('No token found. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      const response = await axios.delete(`/module/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setModules((prevModules) =>
          prevModules.filter((module) => module.id !== moduleId)
        );
      } else {
        throw new Error('Failed to delete module');
      }
    } catch (err) {
      console.error('Error deleting module:', err);
      setError('Could not delete module. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { moduleName, moduleCode, credit, moduleCoordinator, gpa_Status, semesterId } = editingModule;

    if (moduleName.trim() && moduleCode.trim() && credit && moduleCoordinator.trim() && gpa_Status.trim() && semesterId) {
      try {
        const response = await axios.put(
          `/module/${editingModule.moduleId}`, 
          {
            moduleName,
            moduleCode,
            credit: parseInt(credit, 10),
            moduleCoordinator,
            gpa_Status,
            semesterId: parseInt(semesterId, 10),
          }
        );

        const updatedModule = response.data;

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.moduleId === updatedModule.moduleId ? updatedModule : module
          )
        );

        closeEditForm();
      } catch (error) {
        console.error('Error updating module:', error);
        setError('Failed to update module. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
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
              <div key={module.id} className="bg-white flex justify-between items-center">
                <Link to={`/modules/${module.id}`} className="flex-1">
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {module.moduleName}
                  </div>
                </Link>
                <div className="flex space-x-2">
                  {/* <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => openEditForm(module)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label="Edit Module"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div> */}
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(module.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Module"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No modules available.
            </div>
          )}
        </div>
      </div>
      <Footer />
      {editFormOpen && (
        <ModuleCreation
          closeForm={closeEditForm}
          addModule={addModule}
          isEditing={true}
          currentModule={editingModule}
        />
      )}
    </div>
  );
};

export default Modules;
