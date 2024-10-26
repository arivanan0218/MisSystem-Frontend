// import React, { useState,useEffect } from 'react'
// import { Link ,useLocation,useParams } from 'react-router-dom'
// import Header from '../Components/Header'
// import Breadcrum from '../Components/Breadcrumb'
// import Footer from '../Components/Footer'
// import IntakeCreation from '../Components/IntakeCreation'
// import { useUserRole } from '../Context/UserRoleContext';
// import { RiDeleteBin6Fill } from "react-icons/ri";
// import { FaEdit } from "react-icons/fa";

// const Intakes = () => {

//     const { userRole } = useUserRole();
//     const [intakes, setIntakes] = useState([]);
//     const { degreename } = useParams();
//     const[formOpen, setFormOpen] = useState(false);
//     const openForm = () => setFormOpen(true);
//     const closeForm = () => setFormOpen(false);
//     const addIntake = (newIntake) => {
//         setIntakes([...intakes, newIntake]);
//       };



//       const location = useLocation(); // Get the current route location

//     // Example: Checking if the user is coming from 'Students' page or 'Department/Semester' page
//     const isStudentPage = location.pathname.includes('/students');
//     const isDepartmentPage = location.pathname.includes('/department');


//     useEffect(() => {
//         const fetchIntakes = async () => {
//             try {
//             const response = await fetch('https://localhost:7276/api/Intake');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch intakes');
//             }
//             const data = await response.json();
//             const filteredIntake = data.filter(intake => intake.degreename === degreename);
//             setIntakes(filteredIntake);
//             } catch (error) {
//             console.error('Error fetching intakes:', error);
//             }
//         };
//         fetchIntakes();
//     }, []);                                                           

//   return (
//     <div>
//         <Header/>
//         <Breadcrum/>
//         <div className=' mr-[20%]  ml-[10%]  px-8 font-poppins'>
//             {userRole === 'superadmin' && (
//                 <div>
//                     <div className='py-8 flex items-center justify-between'>
//                         <input
//                             type="text"
//                             placeholder='Search'
//                             className='bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md'
//                         />
//                         <button onClick={openForm} className='bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4'>
//                             Add Intake +
//                         </button>
//                         {formOpen && <IntakeCreation closeForm={closeForm} addIntake={addIntake}/>}
//                     </div>
                  
//                 </div>
//             )} 
//             <div className='mt-[80px]'>
//                 {intakes.map((intake) => (
//                     <div key={intake.id} className='flex items-center justify-between text-lg'>
//                         {/* <Link to={`/semesters/${intake.degreename}`} className='w-full' >
//                             <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
//                             {intake.name}
//                             </div>
//                         </Link> */}


//                             <Link 
//                                 to={isStudentPage 
//                                     ? `/students/addStudents`  // If coming from 'Students' page, go to Add Students page
//                                     : `/departments/${intake.degreename}/intakes/semesters`} // Default case for Semester page
//                                 className='w-full'
//                             >
//                                 <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
//                                     {intake.IntakeName}
//                                 </div>
//                             </Link>


//                         <div
//                             className='bg-white text-blue-950 flex items-center justify-center border-[3px] border-blue-950 min-h-[40px] px-2 border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] ml-2 rounded-[6px] cursor-pointer hover:shadow-blue-950 hover:shadow-md mb-3'
//                             // onClick={() => handleEdit(module)}
//                         >
//                             <FaEdit />
//                         </div>

//                         <div
//                             className='bg-white text-blue-950 flex items-center justify-center border-[3px] border-blue-950 min-h-[40px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] ml-2 px-2 rounded-[6px] cursor-pointer hover:shadow-blue-950 hover:shadow-md mb-3'
//                             // onClick={() => openDeleteDialog(module)}
//                         >
//                             <RiDeleteBin6Fill className='text-xl'/>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//         <Footer/>
//     </div>
//   )
// }

// export default Intakes

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Breadcrumb from '../Components/Breadcrumb';
import Footer from '../Components/Footer';
import IntakeCreation from '../Components/IntakeCreation';

const Intakes = () => {
  const [intakes, setIntakes] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const { degreename } = useParams(); // Get degree name from URL

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const addIntake = (newIntake) => {
    setIntakes((prevIntakes) => {
      return Array.isArray(prevIntakes) ? [...prevIntakes, newIntake] : [newIntake];
    });
  };

  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        const response = await fetch('https://localhost:7276/api/Intake');
        if (!response.ok) {
          throw new Error('Failed to fetch intakes');
        }
        const data = await response.json();

        // Log the API response for debugging
        console.log('API Response:', data);

        // Check if the response contains the intakes in the `result` field
        if (data.success && Array.isArray(data.result)) {
          console.log('Fetched intakes:', data.result); // Log fetched data for debugging

          // No filtering is necessary here based on degreeName, adjust according to the API structure
          setIntakes(data.result);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching intakes:', error);
        setError('Could not fetch intakes. Please try again later.');
      }
    };

    fetchIntakes();
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
              aria-label="Add Intake"
            >
              Add Intake +
            </button>
            {formOpen && <IntakeCreation closeForm={closeForm} addIntake={addIntake} />}
          </div>
        </div>

        <div className='mt-[80px]'>
          {error && (
            <div className='text-center text-red-500 mb-4'>{error}</div>
          )}
          {intakes.length > 0 ? (
            intakes.map((intake) => (
              <Link to={`/departments/${intake.intakeId}/intakes/semesters`} key={intake.intakeId}>
                <div className='bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer'>
                  {/* Handle cases where intakeName might be null */}
                  <div>{intake.intakeName || 'Unnamed Intake'}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center text-gray-500'>
              No intakes available.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Intakes;
