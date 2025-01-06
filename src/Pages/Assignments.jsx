// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../Components/Header';
// import Breadcrumb from '../Components/Breadcrumb';
// import Footer from '../Components/Footer';
// import AssignmentCreation from '../Components/AssignmentCreation';
// import axios from '../axiosConfig'; // Import axios for HTTP requests

// const Assignments = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [error, setError] = useState(null);

//   // Retrieve the four IDs from local storage
//   const token = localStorage.getItem('auth-token');
//   const departmentId = localStorage.getItem('departmentId');
//   const intakeId = localStorage.getItem('intakeId');
//   const semesterId = localStorage.getItem('semesterId');
//   const moduleId = localStorage.getItem('moduleId');

//   const openForm = () => setFormOpen(true);
//   const closeForm = () => setFormOpen(false);

//   const addAssignment = (newAssignment) => {
//     setAssignments((prevAssignments) => {
//       return Array.isArray(prevAssignments) ? [...prevAssignments, newAssignment] : [newAssignment];
//     });
//   };

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const token = localStorage.getItem('auth-token'); // Get the auth token
//         const url = `/assignment/module/${departmentId}/${intakeId}/${semesterId}/${moduleId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`;
        
//         const response = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status !== 200) {
//           throw new Error(`Failed to fetch assignments: ${response.statusText}`);
//         }

//         const data = response.data;
//         console.log('Fetched assignments:', data); // Log fetched data for debugging

//         if (Array.isArray(data)) {
//           setAssignments(data); // Set the assignments directly
//         } else {
//           throw new Error('Invalid data structure from API');
//         }
//       } catch (error) {
//         console.error('Error fetching assignments:', error);
//         setError('Could not fetch assignments. Please try again later.');
//       }
//     };

//     // Check if all IDs are available before making the API request
//     if (departmentId && intakeId && semesterId && moduleId) {
//       fetchAssignments();
//     } else {
//       setError('Required IDs not found in local storage.');
//     }
//   }, [departmentId, intakeId, semesterId, moduleId]);

//   return (
//     <div>
//       <Header />
//       <Breadcrumb />
//       <div className='mr-[20%] ml-[10%] px-8 font-poppins'>
//         <div className='py-8 flex items-center justify-between'>
//           <input
//             type="text"
//             placeholder='Search'
//             className='bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md'
//           />
//           <div>
//             <button 
//               onClick={openForm} 
//               className='bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[160px] h-[41px] ml-4'
//               aria-label="Add Assignment"
//             >
//               Add Assignment +
//             </button>
//             {formOpen && <AssignmentCreation closeForm={closeForm} addAssignment={addAssignment} />}
//           </div>
//         </div>

//         <div className='mt-[80px]'>
//           {error && (
//             <div className='text-center text-red-500 mb-4'>{error}</div>
//           )}
//           {assignments.length > 0 ? (
//             assignments.map((assignment) => (
//             <Link to={`/assignments/${assignment.assignmentId}`} key={assignment.assignmentId}>
//                 <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
//                     <div>{assignment.assignmentName || 'Unnamed Assignment'}</div>
//                 </div>
//             </Link>
//             ))
//           ) : (
//             <div className='text-center text-gray-500'>
//               No assignments available.
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Assignments;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import AssignmentCreation from '../Components/AssignmentCreation';
import axios from '../axiosConfig'; // Import axios for HTTP requests

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);

  // Get IDs from localStorage
  const token = localStorage.getItem('auth-token');
  const departmentId = localStorage.getItem('departmentId');
  const intakeId = localStorage.getItem('intakeId');
  const semesterId = localStorage.getItem('semesterId');
  const moduleId = localStorage.getItem('moduleId');

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const addAssignment = (newAssignment) => {
    setAssignments((prevAssignments) => {
      return Array.isArray(prevAssignments) ? [...prevAssignments, newAssignment] : [newAssignment];
    });
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (!departmentId || !intakeId || !semesterId || !moduleId) {
          setError('Required data missing from localStorage.');
          return;
        }

        const response = await axios.get(
          `/assignment/module/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch assignments: ${response.statusText}`);
        }

        const data = response.data;
        console.log('Fetched assignments:', data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setAssignments(data); // Set the assignments directly
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Could not fetch assignments. Please try again later.');
      }
    };

    fetchAssignments();
  }, [departmentId, intakeId, semesterId, moduleId, token]);

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
              className='bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[160px] h-[41px] ml-4'
              aria-label="Add Assignment"
            >
              Add Assignment +
            </button>
            {formOpen && <AssignmentCreation closeForm={closeForm} addAssignment={addAssignment} />}
          </div>
        </div>

        <div className='mt-[80px]'>
          {error && (
            <div className='text-center text-red-500 mb-4'>{error}</div>
          )}
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <Link 
                to={`/assignments/${assignment.assignmentId}`} 
                key={assignment.assignmentId}
                onClick={() => localStorage.setItem('assignmentId', assignment.assignmentId)}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  <div>{assignment.assignmentName || 'Unnamed Assignment'}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No assignments available.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Assignments;
