// import React, { useState ,useEffect} from 'react';
// import {useParams} from 'react-router-dom'

// const SemesterCreation = ({ closeForm, addSemester }) => {
//   const [semesterName, setSemesterName] = useState('');
//   const [duration, setDuration] = useState(''); 
//   const { degreename } = useParams();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (semesterName.trim() && duration.trim()) {
//       const newSemester = {
//         id: Date.now(),
//         name: semesterName,
//         duration: duration,
//         degreename:degreename
//       };
//       try {
//         // Replace this URL with your actual POST endpoint
//         const response = await fetch('http://localhost:5000/semester', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newSemester),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to add semester');
//         }
//         const savedSemester = await response.json();
//         addSemester(savedSemester);
//         closeForm();
        
//       } catch (error) {
//         console.error('Error adding semester:', error);
//       }
//     }
//   };
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
//       <div className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950" onClick={(e) => e.stopPropagation()}>
//         <h1 className='text-blue-950 text-2xl font-semibold'>Add semester</h1>
//         <div className='m-10'>
//           <form>
//             <div className='mb-6'>
//               <label htmlFor="semesterName" className='block mb-2 text-blue-950 text-lg font-semibold'>semester Name</label>
//               <input 
//                 type="text"
//                 id="semesterName"
//                 value={semesterName}
//                 onChange={(e) => setSemesterName(e.target.value)}
//                 className='border border-blue-950 p-2 rounded w-full'
//               />
//             </div>
//             <div className='mb-4'>
//               <label htmlFor="duration" className='block mb-2 text-blue-950 text-lg font-semibold'>Duration</label>
//               <input 
//                 type="text"
//                 id="duration"
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 className='border border-blue-950 p-2 rounded w-[50%]'
//               />
//             </div>
            
//           </form>
//           <div className='flex justify-end'>
//             <button onClick={closeForm} className='lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950'>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} className='lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg'>
//               Add
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SemesterCreation;


import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const SemesterCreation = ({ closeForm, addSemester }) => {
  const [semesterName, setSemesterName] = useState('');
  const [duration, setDuration] = useState('');
  const { degreename } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (semesterName.trim() && duration.trim()) {
      const newSemester = {
        SemesterId: Date.now(),
        SemesterName: semesterName,
        Duration: duration,
        DegreeName: degreename
      };
      try {
        const response = await fetch('https://localhost:7276/api/Semester', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSemester),
        });

        if (!response.ok) {
          throw new Error('Failed to add semester');
        }
        const savedSemester = await response.json();
        addSemester(savedSemester);
        closeForm();

      } catch (error) {
        console.error('Error adding semester:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
      <div className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950" onClick={(e) => e.stopPropagation()}>
        <h1 className='text-blue-950 text-2xl font-semibold'>Add Semester</h1>
        <div className='m-10'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label htmlFor="semesterName" className='block mb-2 text-blue-950 text-lg font-semibold'>Semester Name</label>
              <input 
                type="text"
                id="semesterName"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                className='border border-blue-950 p-2 rounded w-full'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="duration" className='block mb-2 text-blue-950 text-lg font-semibold'>Duration</label>
              <input 
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className='border border-blue-950 p-2 rounded w-[50%]'
              />
            </div>
            <div className='flex justify-end'>
              <button type="button" onClick={closeForm} className='lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950'>
                Cancel
              </button>
              <button type="submit" className='lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg'>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SemesterCreation;
