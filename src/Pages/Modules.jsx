// import React, { useState, useEffect } from 'react';
// import Header from '../Components/Header';
// import Breadcrum from '../Components/Breadcrumb';
// import Footer from '../Components/Footer';
// import { Link } from 'react-router-dom';
// import ModuleCreation from '../Components/ModuleCreation';
// import DeleteModule from '../Components/DeleteModule';
// import { RiDeleteBin6Fill } from "react-icons/ri";
// import { FaEdit } from "react-icons/fa";
// import { useUserRole } from '../Context/UserRoleContext';

// const Modules = () => {
//   const { userRole } = useUserRole();
//   const [modules, setModules] = useState([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentModule, setCurrentModule] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [moduleToDelete, setModuleToDelete] = useState(null);

//   const openForm = () => setFormOpen(true);
//   const closeForm = () => {
//     setFormOpen(false);
//     setIsEditing(false);
//     setCurrentModule(null);
//   };

//   const addModule = (newModule) => {
//     setModules([...modules, newModule]);
//   };

//   const handleEdit = (module) => {
//     setIsEditing(true);
//     setCurrentModule(module);
//     setFormOpen(true);
//   };

//   const updateModule = (updatedModule) => {
//     setModules(modules.map(mod => mod.id === updatedModule.id ? updatedModule : mod));
//     closeForm();
//   };

//   const openDeleteDialog = (module) => {
//     setModuleToDelete(module);
//     setDeleteDialogOpen(true);
//   };

//   const closeDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setModuleToDelete(null);
//   };

//   const deleteModule = () => {
//     setModules(modules.filter(mod => mod.id !== moduleToDelete.id));
//     closeDeleteDialog();
//   };

//   return (
//     <div>
//       <Header/>
//       <Breadcrum/>
//       <div className='mr-[20%] ml-[10%] px-8 font-poppins'>
//         <div className='py-8 flex items-center justify-between'>
//           <input
//             type="text"
//             placeholder='Search'
//             className='bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md'
//           />
//           {userRole === 'superadmin' && (
//             <div>
//               <Link to={''}>
//               <button onClick={openForm} className='bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4'>
//                 Add +
//               </button>
//               </Link>
//             </div>
//           )}
          
//         </div>

//         <div className='mt-[80px]'>
//           {modules.map((module) => (
//             <div key={module.id} className='flex items-center justify-between text-lg'>
//               <Link to={`/module/${module.id}`} className='w-full'>
//                 <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
//                   {module.name}
//                 </div>
//               </Link>

//               <div
//                 className='bg-white text-blue-950 flex items-center justify-center border-[3px] border-blue-950 min-h-[40px] px-2 border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] ml-2 rounded-[6px] cursor-pointer hover:shadow-blue-950 hover:shadow-md mb-3'
//                 onClick={() => handleEdit(module)}
//               >
//                 <FaEdit />
//               </div>

//               <div
//                 className='bg-white text-blue-950 flex items-center justify-center border-[3px] border-blue-950 min-h-[40px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] ml-2 px-2 rounded-[6px] cursor-pointer hover:shadow-blue-950 hover:shadow-md mb-3'
//                 onClick={() => openDeleteDialog(module)}
//               >
//                 <RiDeleteBin6Fill className='text-xl'/>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {formOpen && (
//         <ModuleCreation
//           closeForm={closeForm}
//           addModule={isEditing ? updateModule : addModule}
//           isEditing={isEditing}
//           currentModule={currentModule}
//         />
//       )}

//       {deleteDialogOpen && (
//         <DeleteModule
//           onClose={closeDeleteDialog}
//           onDelete={deleteModule}
//         />
//       )}

//       <Footer/>
//     </div>
//   );
// }

// export default Modules;


import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import ModuleCreation from '../Components/ModuleCreation';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const { degreename } = useParams(); // Get degree name from URL

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
        const response = await fetch('https://localhost:7276/api/Module');
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();

        // Log the API response for debugging
        console.log('API Response:', data);

        // Check if the response contains the modules in the `result` field
        if (data.success && Array.isArray(data.result)) {
          console.log('Fetched modules:', data.result); // Log fetched data for debugging

          // No filtering is necessary here based on degreeName, adjust according to the API structure
          setModules(data.result);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('Could not fetch modules. Please try again later.');
      }
    };

    fetchModules();
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
              <Link to={`/departments/${module.moduleId}/modules`} key={module.moduleId}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  {/* Handle cases where ModuleName might be null */}
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
