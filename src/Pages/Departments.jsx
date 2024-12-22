// import React, { useState, useEffect } from 'react';
// import Footer from '../Components/Footer';
// import { Link } from 'react-router-dom';
// import Header from '../Components/Header';
// import Breadcrumb from '../Components/Breadcrumb';
// import DegreeProgramCreation from '../Components/DegreeProgramCreation';
// import edit from '../assets/img/edit.svg'
// import deleteIcon from '../assets/img/delete.svg'

// const Departments = () => {
//   const [degrees, setDegrees] = useState([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [editFormOpen, setEditFormOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingDegree, setEditingDegree] = useState(null);

//   const openForm = () => setFormOpen(true);
//   const closeForm = () => setFormOpen(false);

//   const openEditForm = (degree) => {
//     setEditingDegree(degree);
//     setEditFormOpen(true);
//   };
//   const closeEditForm = () => {
//     setEditingDegree(null);
//     setEditFormOpen(false);
//   };

//   const addDegree = (newDegree) => {
//     setDegrees((prevDegrees) => {
//       return Array.isArray(prevDegrees) ? [...prevDegrees, newDegree] : [newDegree];
//     });
//   };

//   const handleDelete = async (degreeId) => {
//     try {
//       const response = await fetch(`http://localhost:8081/api/department/${degreeId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete degree');
//       }

//       // Remove the deleted degree from the state
//       setDegrees((prevDegrees) =>
//         prevDegrees.filter((degree) => degree.id !== degreeId)
//       );
//     } catch (err) {
//       console.error('Error deleting degree:', err);
//       setError('Could not delete degree. Please try again later.');
//     }
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     const { departmentName, departmentCode } = editingDegree;

//     if (departmentName.trim() && departmentCode.trim()) {
//       try {
//         const response = await fetch(`http://localhost:8081/api/department/${editingDegree.id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ departmentName, departmentCode }),
//         });

//         const updatedDegree = await response.json();

//         if (!response.ok) {
//           throw new Error('Failed to update degree');
//         }

//         // Update the UI with the updated degree
//         setDegrees((prevDegrees) =>
//           prevDegrees.map((degree) =>
//             degree.id === updatedDegree.id ? updatedDegree : degree
//           )
//         );

//         closeEditForm(); // Close the edit form/modal
//       } catch (error) {
//         console.error('Error updating degree:', error);
//         setError('Failed to update degree. Please try again.');
//       }
//     } else {
//       setError('Please fill out all fields.');
//     }
//   };

//   useEffect(() => {
//     const fetchDegrees = async () => {
//       try {
//         const response = await fetch('http://localhost:8081/api/department/');
//         if (!response.ok) {
//           throw new Error(`Failed to fetch degrees: ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log('Fetched degrees:', data); // Log fetched data for debugging

//         if (Array.isArray(data)) {
//           setDegrees(data); // Set the degrees directly from the response
//         } else {
//           throw new Error('Unexpected data structure from API');
//         }
//       } catch (err) {
//         console.error('Error fetching degrees:', err);
//         setError('Could not fetch degrees. Please try again later.');
//       }
//     };

//     fetchDegrees();
//   }, []);

//   return (
//     <div>
//       <Header />
//       <Breadcrumb />
//       <div className="mr-[20%] ml-[10%] px-8 font-poppins">
//         <div className="py-8 flex items-center justify-between">
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
//           />
//           <div>
//             <button
//               onClick={openForm}
//               className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
//               aria-label="Add Degree Program"
//             >
//               Add Degree +
//             </button>
//             {formOpen && <DegreeProgramCreation closeForm={closeForm} addDegree={addDegree} />}
//           </div>
//         </div>

//         <div className="mt-[80px]">
//           {error && <div className="text-center text-red-500 mb-4">{error}</div>}
//           {degrees.length > 0 ? (
//             degrees.map((degree) => (
//               <div
//                 key={degree.id}
//                 className="bg-white flex justify-between items-center"
//               >
//                 <Link to={`/departments/${degree.id}/intakes`} className="flex-1">
//                   <div

//                   key={degree.id}
//                   className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center"

//                   >{degree.departmentName}</div>
//                 </Link>
//                 <div className="flex space-x-2">
//                   <div
//                   className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center"                  
//                   >

//                     <button
//                       onClick={() => openEditForm(degree)}
//                       className="text-yellow-500 hover:text-yellow-700"
//                       aria-label="Edit Degree"
//                     >
//                       <img src={edit} alt="edit" />
//                     </button>

//                   </div>
                    

//                   <div
//                     className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center"                               
//                   >
//                     <button
//                         onClick={() => handleDelete(degree.id)}
//                         className="text-red-500 hover:text-red-700"
//                         aria-label="Delete Degree"
//                       >
//                         <img src={deleteIcon} alt="delete" />
//                       </button>

//                   </div>
                  
                  
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500">No degrees available.</div>
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
//             <h1 className="text-blue-950 text-2xl font-semibold">Edit Degree</h1>
//             <form onSubmit={handleEdit}>
//               {error && <div className="mb-4 text-red-500">{error}</div>}
//               <div className="mb-6">
//                 <label
//                   htmlFor="degreeName"
//                   className="block mb-2 text-blue-950 text-lg font-semibold"
//                 >
//                   Degree Name
//                 </label>
//                 <input
//                   type="text"
//                   id="degreeName"
//                   value={editingDegree?.departmentName || ''}
//                   onChange={(e) => setEditingDegree({ ...editingDegree, departmentName: e.target.value })}
//                   className="border border-blue-950 p-2 rounded w-full"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="degreeCode"
//                   className="block mb-2 text-blue-950 text-lg font-semibold"
//                 >
//                   Degree Code
//                 </label>
//                 <input
//                   type="text"
//                   id="degreeCode"
//                   value={editingDegree?.departmentCode || ''}
//                   onChange={(e) => setEditingDegree({ ...editingDegree, departmentCode: e.target.value })}
//                   className="border border-blue-950 p-2 rounded w-[50%]"
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

// export default Departments;


import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import DegreeProgramCreation from '../Components/DegreeProgramCreation';
import edit from '../assets/img/edit.svg';
import deleteIcon from '../assets/img/delete.svg';

const Departments = () => {
  const [degrees, setDegrees] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingDegree, setEditingDegree] = useState(null);

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (degree) => {
    setEditingDegree(degree);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingDegree(null);
    setEditFormOpen(false);
  };

  const addDegree = (newDegree) => {
    setDegrees((prevDegrees) => {
      return Array.isArray(prevDegrees) ? [...prevDegrees, newDegree] : [newDegree];
    });
  };

  const handleDelete = async (degreeId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/department/${degreeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete degree');
      }

      // Remove the deleted degree from the state
      setDegrees((prevDegrees) =>
        prevDegrees.filter((degree) => degree.id !== degreeId)
      );
    } catch (err) {
      console.error('Error deleting degree:', err);
      setError('Could not delete degree. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { departmentName, departmentCode } = editingDegree;

    if (departmentName.trim() && departmentCode.trim()) {
      try {
        const response = await fetch(`http://localhost:8081/api/department/${editingDegree.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ departmentName, departmentCode }),
        });

        const updatedDegree = await response.json();

        if (!response.ok) {
          throw new Error('Failed to update degree');
        }

        // Update the UI with the updated degree
        setDegrees((prevDegrees) =>
          prevDegrees.map((degree) =>
            degree.id === updatedDegree.id ? updatedDegree : degree
          )
        );

        closeEditForm(); // Close the edit form/modal
      } catch (error) {
        console.error('Error updating degree:', error);
        setError('Failed to update degree. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/department/');
        if (!response.ok) {
          throw new Error(`Failed to fetch degrees: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched degrees:', data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setDegrees(data); // Set the degrees directly from the response
        } else {
          throw new Error('Unexpected data structure from API');
        }
      } catch (err) {
        console.error('Error fetching degrees:', err);
        setError('Could not fetch degrees. Please try again later.');
      }
    };

    fetchDegrees();
  }, []);

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          <div>
            <button
              onClick={openForm}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
              aria-label="Add Degree Program"
            >
              Add Degree +
            </button>
            {formOpen && <DegreeProgramCreation closeForm={closeForm} addDegree={addDegree} />}
          </div>
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {degrees.length > 0 ? (
            degrees.map((degree) => (
              <div
                key={degree.id}
                className="bg-white flex justify-between items-center"
              >
                <Link
                  to={`/departments/${degree.id}/intakes`}
                  className="flex-1"
                  onClick={() => localStorage.setItem('departmentId', degree.id)} // Save departmentId to localStorage
                >
                  <div
                    key={degree.id}
                    className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center"
                  >
                    {degree.departmentName}
                  </div>
                </Link>
                <div className="flex space-x-2">
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => openEditForm(degree)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label="Edit Degree"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div>

                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(degree.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Degree"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No degrees available.</div>
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
            <h1 className="text-blue-950 text-2xl font-semibold">Edit Degree</h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-6">
                <label
                  htmlFor="degreeName"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Degree Name
                </label>
                <input
                  type="text"
                  id="degreeName"
                  value={editingDegree?.departmentName || ''}
                  onChange={(e) => setEditingDegree({ ...editingDegree, departmentName: e.target.value })}
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="degreeCode"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Degree Code
                </label>
                <input
                  type="text"
                  id="degreeCode"
                  value={editingDegree?.departmentCode || ''}
                  onChange={(e) => setEditingDegree({ ...editingDegree, departmentCode: e.target.value })}
                  className="border border-blue-950 p-2 rounded w-[50%]"
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
    </div>
  );
};

export default Departments;
