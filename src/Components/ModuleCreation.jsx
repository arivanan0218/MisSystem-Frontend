// import React, { useState, useEffect } from 'react';

// const ModuleCreation = ({ closeForm, addModule, isEditing, currentModule }) => {
//   const [moduleName, setModuleName] = useState('');
//   const [credits, setCredits] = useState(''); 

//   // Populate form fields with current module data when editing
//   useEffect(() => {
//     if (isEditing && currentModule) {
//       setModuleName(currentModule.name);
//       setCredits(currentModule.credits);
//     }
//   }, [isEditing, currentModule]);

//   const handleSubmit = (e) => {
//     e.preventDefault(); // prevent refreshing
//     if (moduleName.trim() && credits.trim()) {
//       const updatedModule = {
//         id: isEditing ? currentModule.id : Date.now(),
//         name: moduleName,
//         credits: credits
//       };
//       addModule(updatedModule);
//       closeForm();
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
//       <div className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950" onClick={(e) => e.stopPropagation()}>
//         <h1 className='text-blue-950 text-2xl font-semibold'>
//           {isEditing ? 'Edit Module' : 'Add Module'}
//         </h1>
//         <div className='m-10'>
//           <form>
//             <div className='mb-6'>
//               <label htmlFor="moduleName" className='block mb-2 text-blue-950 text-lg font-semibold'>Module Name</label>
//               <input 
//                 type="text"
//                 id="moduleName"
//                 value={moduleName}
//                 onChange={(e) => setModuleName(e.target.value)}
//                 className='border border-blue-950 p-2 rounded w-full'
//               />
//             </div>
//             <div className='mb-4'>
//               <label htmlFor="credits" className='block mb-2 text-blue-950 text-lg font-semibold'>No. of Credits</label>
//               <input 
//                 type="number"
//                 id="credits"
//                 value={credits}
//                 onChange={(e) => setCredits(e.target.value)}
//                 className='border border-blue-950 p-2 rounded w-[50%]'
//               />
//             </div>
//           </form>
//           <div className='flex justify-end'>
//             <button onClick={closeForm} className='lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950'>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} className='lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg'>
//               {isEditing ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModuleCreation;


import React, { useState, useEffect } from 'react';

const ModuleCreation = ({ closeForm, addModule, isEditing, currentModule }) => {
  const [moduleName, setModuleName] = useState('');
  const [credits, setCredits] = useState('');

  // Populate form fields with current module data when editing
  useEffect(() => {
    if (isEditing && currentModule) {
      setModuleName(currentModule.name);
      setCredits(currentModule.credits);
    }
  }, [isEditing, currentModule]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing
    if (moduleName.trim() && credits.trim()) {
      const newModule = {
        ModuleId: isEditing ? currentModule.id : Date.now(),
        ModuleName: moduleName,
        ModuleCredit: credits,
      };

      try {
        const response = await fetch('https://localhost:7276/api/Module', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newModule),
        });

        if (!response.ok) {
          throw new Error('Failed to add module');
        }

        const savedModule = await response.json();
        addModule(savedModule);
        closeForm();
      } catch (error) {
        console.error('Error adding module:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
      <div className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950" onClick={(e) => e.stopPropagation()}>
        <h1 className='text-blue-950 text-2xl font-semibold'>
          {isEditing ? 'Edit Module' : 'Add Module'}
        </h1>
        <div className='m-10'>
          <form>
            <div className='mb-6'>
              <label htmlFor="moduleName" className='block mb-2 text-blue-950 text-lg font-semibold'>Module Name</label>
              <input
                type="text"
                id="moduleName"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className='border border-blue-950 p-2 rounded w-full'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="credits" className='block mb-2 text-blue-950 text-lg font-semibold'>No. of Credits</label>
              <input
                type="number"
                id="credits"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className='border border-blue-950 p-2 rounded w-[50%]'
              />
            </div>
          </form>
          <div className='flex justify-end'>
            <button onClick={closeForm} className='lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950'>
              Cancel
            </button>
            <button onClick={handleSubmit} className='lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg'>
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCreation;
