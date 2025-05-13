import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import Footer from '../../Components/Footer';
import SemesterCreation from './SemesterCreation';
import axios from '../../axiosConfig'; // Import axios for HTTP requests
import edit from '../../assets/img/edit.svg';
import deleteIcon from '../../assets/img/delete.svg';

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);

  const token = localStorage.getItem('auth-token');

  // Get the user role from localStorage
  const userRole = localStorage.getItem('userRole');

  const intakeId = localStorage.getItem('intakeId');
  const departmentId = localStorage.getItem('departmentId'); 

//   const departmentId = localStorage.getItem('departmentId'); 
//   const intakeId = localStorage.getItem('intakeId');


  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

 /*  const openEditForm = (semester) => {
    setEditingSemester(semester);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingSemester(null);
    setEditFormOpen(false);
  };
 */
  const addSemester = (newSemester) => {
    setSemesters((prevSemesters) => {
      return Array.isArray(prevSemesters) ? [...prevSemesters, newSemester] : [newSemester];
    });
  };
  const openEditForm = (semester) => {
    setEditingSemester(semester);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingSemester(null);
    setEditFormOpen(false);
  };

  const handleDelete = async (semesterId) => {
    try {
      const token = localStorage.getItem('auth-token'); // Retrieve auth-token
      if (!token) {
        console.error('No token found. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      const response = await axios.delete(`/semester/${semesterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSemesters((prevSemesters) =>
          prevSemesters.filter((semester) => semester.id !== semesterId)
        );
      } else {
        throw new Error('Failed to delete semester');
      }
    } catch (err) {
      console.error('Error deleting semester:', err);
      setError('Could not delete semester. Please try again later.');
    }
  };


  const handleEdit = async (e) => {
    e.preventDefault();
    const { semesterName, semesterYear, semesterDuration } = editingSemester;

    if (semesterName.trim() && semesterYear.trim() && semesterDuration.trim()) {
      try {
        const response = await axios.put(
          `/semester/${editingSemester.id}`, 
          {
            semesterName,
            semesterYear,
            semesterDuration,
            intakeId: editingSemester.intakeId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedSemester = response.data;

        setSemesters((prevSemesters) =>
          prevSemesters.map((semester) =>
            semester.id === updatedSemester.id ? updatedSemester : semester
          )
        );

        closeEditForm();
      } catch (error) {
        console.error('Error updating semester:', error);
        setError('Failed to update semester. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        if (!intakeId || !departmentId) {
          setError('Required data missing from localStorage.');
          return;
        }

        const response = await axios.get(
          `/semester/intake/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch semesters: ${response.statusText}`);
        }

        const data = response.data;
        console.log('Fetched semesters:', data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setSemesters(data); // Set the semesters directly
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setError('Could not fetch semesters. Please try again later.');
      }
    };

    fetchSemesters();
  }, [intakeId, departmentId, token]); // Run when intakeId, departmentId, or token changes

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[
         { label: 'Home', link: '/departments' },
         { label: 'Degree Programs', link: `/departments` },
         { label: 'Intakes', link: `/departments/${departmentId}/intakes` },// Correct path with intakeName
         // Correct path with intakeName
          ]} />
          <div className='mr-[20%] ml-[10%] px-8 font-poppins'>
            <div className='py-8 flex items-center justify-between'>
              <input
            type="text"
            placeholder='Search'
            className='bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md'
              />
              {userRole === 'ROLE_AR' && (
            <div>
            <button 
              onClick={openForm} 
              className='bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4'
              aria-label="Add Semester"
            >
              Add Semester +
            </button>
            {formOpen && <SemesterCreation closeForm={closeForm} addSemester={addSemester} />}

            <Link to={"/viewFinalResults"}>
                <button className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900">
                  View finel Results
                </button>
              </Link>

              </div>
              )}
              
            </div>

            <div className="mt-[80px]">
              {error && <div className="text-center text-red-500 mb-4">{error}</div>}
              {semesters.length > 0 ? (
            semesters.map((semester) => (
              <div key={semester.id} className="bg-white flex justify-between items-center">
                <Link
              to={`/departments/${semester.id}/intakes/semesters/modules`}
              className="flex-1"
              onClick={() => {
                localStorage.setItem('semesterId', semester.id); // Save semesterId to localStorage
                localStorage.setItem('semesterName', semester.semesterName); // Save semesterName to localStorage
              }}
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {semester.semesterName}
                  </div>
                </Link>

                {userRole === 'ROLE_AR' && (
                  <div className="flex space-x-2">
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => openEditForm(semester)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label="Edit Degree"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div>

                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(semester.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Semester"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div>
                )}
                
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No semester available.</div>
          )}
        </div>
      </div>

      {editFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeEditForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Edit Semester</h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-6">
                <label htmlFor="semesterName" className="block mb-2 text-blue-950 text-lg font-semibold">
                  Semester Name
                </label>
                <input
                  type="text"
                  id="semesterName"
                  value={editingSemester?.semesterName || ''}
                  onChange={(e) =>
                    setEditingSemester({ ...editingSemester, semesterName: e.target.value })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="semesterYear" className="block mb-2 text-blue-950 text-lg font-semibold">
                  Semester Year
                </label>
                <input
                  type="text"
                  id="semesterYear"
                  value={editingSemester?.semesterYear || ''}
                  onChange={(e) =>
                    setEditingSemester({ ...editingSemester, semesterYear: e.target.value })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="semesterDuration" className="block mb-2 text-blue-950 text-lg font-semibold">
                  Semester Duration
                </label>
                <input
                  type="text"
                  id="semesterDuration"
                  value={editingSemester?.semesterDuration || ''}
                  onChange={(e) =>
                    setEditingSemester({ ...editingSemester, semesterDuration: e.target.value })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
      {editFormOpen && (
        <SemesterCreation
          closeForm={closeEditForm}
          addSemester={addSemester}
          isEditing={true}
          currentSemester={editingSemester}
        />
      )}
    </div>
  );
};

export default Semesters;

////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../Components/Header';
// import Breadcrumb from '../Components/Breadcrumb';
// import Footer from '../Components/Footer';
// import SemesterCreation from '../Components/SemesterCreation';
// import axios from '../axiosConfig';
// import editIcon from '../assets/img/edit.svg';
// import deleteIcon from '../assets/img/delete.svg';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [editFormOpen, setEditFormOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingSemester, setEditingSemester] = useState(null);

//   const token = localStorage.getItem('auth-token');
//   const userRole = localStorage.getItem('userRole');
//   const intakeId = localStorage.getItem('intakeId');
//   const departmentId = localStorage.getItem('departmentId');

//   const openForm = () => setFormOpen(true);
//   const closeForm = () => setFormOpen(false);
//   const openEditForm = (semester) => {
//     setEditingSemester(semester);
//     setEditFormOpen(true);
//   };
//   const closeEditForm = () => {
//     setEditingSemester(null);
//     setEditFormOpen(false);
//   };

//   const addSemester = (newSemester) => {
//     setSemesters((prevSemesters) => [...prevSemesters, newSemester]);
//   };

//   const handleDelete = async (semesterId) => {
//     try {
//       if (!token) {
//         console.error('No token found. Redirecting to login.');
//         window.location.href = '/login';
//         return;
//       }

//       const response = await axios.delete(`/semester/${semesterId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setSemesters((prevSemesters) =>
//           prevSemesters.filter((semester) => semester.id !== semesterId)
//         );
//       } else {
//         throw new Error('Failed to delete semester');
//       }
//     } catch (err) {
//       console.error('Error deleting semester:', err);
//       setError('Could not delete semester. Please try again later.');
//     }
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     const { semesterName, semesterYear, semesterDuration } = editingSemester;

//     if (!semesterName.trim() || !semesterYear.trim() || !semesterDuration.trim()) {
//       setError('Please fill out all fields.');
//       return;
//     }

//     try {
//       if (!token) {
//         console.error('No token found. Redirecting to login.');
//         window.location.href = '/login';
//         return;
//       }

//       const response = await axios.put(
//         `/semester/${editingSemester.id}`,
//         {
//           semesterName,
//           semesterYear,
//           semesterDuration,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedSemester = response.data;

//       setSemesters((prevSemesters) =>
//         prevSemesters.map((semester) =>
//           semester.id === updatedSemester.id ? updatedSemester : semester
//         )
//       );

//       closeEditForm();
//     } catch (error) {
//       console.error('Error updating semester:', error);
//       setError('Failed to update semester. Please try again.');
//     }
//   };

//   useEffect(() => {
//     const fetchSemesters = async () => {
//       try {
//         if (!intakeId || !departmentId) {
//           setError('Required data missing from localStorage.');
//           return;
//         }

//         const response = await axios.get(
//           `/semester/intake/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status !== 200) {
//           throw new Error(`Failed to fetch semesters: ${response.statusText}`);
//         }

//         const data = response.data;
//         if (Array.isArray(data)) {
//           setSemesters(data);
//         } else {
//           throw new Error('Invalid data structure from API');
//         }
//       } catch (error) {
//         console.error('Error fetching semesters:', error);
//         setError('Could not fetch semesters. Please try again later.');
//       }
//     };

//     fetchSemesters();
//   }, [intakeId, departmentId, token]);

//   return (
//     <div>
//       <Header />
//       <Breadcrumb
//         breadcrumb={[
//           { label: 'Home', link: '/departments' },
//           { label: 'Degree Programs', link: `/departments` },
//           { label: 'Intakes', link: `/departments/${departmentId}/intakes` },
//           { label: 'Semesters', link: `/departments/${departmentId}/intakes/${intakeId}/semesters` },
//         ]}
//       />
//       <div className="mr-[20%] ml-[10%] px-8 font-poppins">
//         <div className="py-8 flex items-center justify-between">
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
//           />
//           {userRole === 'ROLE_AR' && (
//             <button
//               onClick={openForm}
//               className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
//               aria-label="Add Semester"
//             >
//               Add Semester +
//             </button>
//           )}
//           {formOpen && <SemesterCreation closeForm={closeForm} addSemester={addSemester} />}
//         </div>

//         <div className="mt-[80px]">
//           {error && <div className="text-center text-red-500 mb-4">{error}</div>}
//           {semesters.length > 0 ? (
//             semesters.map((semester) => (
//               <div key={semester.id} className="bg-white flex justify-between items-center">
//                 <Link
//                   to={`/semesters/${semester.id}/modules`}
//                   className="flex-1"
//                   onClick={() => localStorage.setItem('semesterId', semester.id)}
//                 >
//                   <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
//                     {semester.semesterName}
//                   </div>
//                 </Link>

//                 {userRole === 'ROLE_AR' && (
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => openEditForm(semester)}
//                       className="bg-white border-none"
//                       aria-label="Edit Semester"
//                     >
//                       <img src={editIcon} alt="Edit" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(semester.id)}
//                       className="bg-white border-none"
//                       aria-label="Delete Semester"
//                     >
//                       <img src={deleteIcon} alt="Delete" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500">No semester available.</div>
//           )}
//         </div>
//       </div>

//       {editFormOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//           onClick={closeEditForm}
//         >
//           <div
//             className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h1 className="text-blue-950 text-2xl font-semibold">Edit Semester</h1>
//             <form onSubmit={handleEdit}>
//               {error && <div className="mb-4 text-red-500">{error}</div>}
//               <div className="mb-6">
//                 <label htmlFor="semesterName" className="block mb-2 text-blue-950 text-lg font-semibold">
//                   Semester Name
//                 </label>
//                 <input
//                   type="text"
//                   id="semesterName"
//                   value={editingSemester?.semesterName || ''}
//                   onChange={(e) =>
//                     setEditingSemester({ ...editingSemester, semesterName: e.target.value })
//                   }
//                   className="border border-blue-950 p-2 rounded w-full"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="semesterYear" className="block mb-2 text-blue-950 text-lg font-semibold">
//                   Semester Year
//                 </label>
//                 <input
//                   type="text"
//                   id="semesterYear"
//                   value={editingSemester?.semesterYear || ''}
//                   onChange={(e) =>
//                     setEditingSemester({ ...editingSemester, semesterYear: e.target.value })
//                   }
//                   className="border border-blue-950 p-2 rounded w-full"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="semesterDuration" className="block mb-2 text-blue-950 text-lg font-semibold">
//                   Semester Duration
//                 </label>
//                 <input
//                   type="text"
//                   id="semesterDuration"
//                   value={editingSemester?.semesterDuration || ''}
//                   onChange={(e) =>
//                     setEditingSemester({ ...editingSemester, semesterDuration: e.target.value })
//                   }
//                   className="border border-blue-950 p-2 rounded w-full"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   onClick={closeEditForm}
//                   type="button"
//                   className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default Semesters;
