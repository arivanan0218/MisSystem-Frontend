import React, { useState, useEffect } from 'react';
import { MdDashboard } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { MdGrading } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaBackward } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ children, setBreadcrumb }) => {
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const toggle = () => setOpen(!open);
  
  // Use the navigate function to handle redirects
  const navigate = useNavigate();

  // Get user role from localStorage on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
    console.log('User role:', role);
  }, []);

  // Check if user is a student
  const isStudent = userRole === 'ROLE_STUDENT';
  
  // Check if user is lecturer, HOD, or module coordinator
  const isLecturerOrAdmin = ['ROLE_LECTURER', 'ROLE_HOD', 'ROLE_MODULE_COORDINATOR'].includes(userRole);
  
  // Check if user is admin
  const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_AR';
  
  // Log the user role and conditions for debugging
  console.log('Current user role:', userRole);
  console.log('Is student:', isStudent);
  console.log('Is lecturer or similar:', isLecturerOrAdmin);
  console.log('Is admin:', isAdmin);

  const logout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token'); // Updated from 'auth-token' to 'token'
    localStorage.removeItem('userRole');
    localStorage.removeItem('departmentId'); // Clear the departmentId

    // Redirect to the login page
    navigate('/'); // Adjust URL if necessary
  };

  return (
    <div className='flex font-poppins'>
      <div className={`z-10 flex flex-row md:flex-col justify-between ${open ? '' : 'w-20'} md:h-screen
      h-12 w-full md:w-auto bg-[#f4f8ff] font-poppins fixed top-0 left-0`}>
        <div className=''>
          <div className={`hidden md:flex  items-center mt-10 mb-10 text-blue-950`}>
            <h1 className={`${open ? 'text-[24px] font-bold ml-7 mr-10 duration-300' : 'scale-0 ml-0 -mr-2'}`}>
              Menu
            </h1>
            <FaBackward
              className={`cursor-pointer transform duration-300 ${!open && 'rotate-180 mr-6'}`}
              onClick={toggle}
            />
          </div>
          <ul className='flex felx-row gap-x-8 md:flex-col text-blue-950 font-bold pl-2 md:pl-7 mt-1 '>
            {/* Home icon - visible to all users */}
            <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
              <Link to={'/departments'} onClick={() => setBreadcrumb('Site Home')}>
                <IoHome className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                {open && <span>Site Home</span>}
              </Link>
            </li>
            {/* Lecturer icon - visible only to admin users */}
            {isAdmin && (
              <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
                <Link to={'/LecturerDepartments'} onClick={() => setBreadcrumb('Lecturers')}>
                  <FaChalkboardTeacher className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                  {open && <span>Lecturers</span>}
                </Link>
              </li>
            )}
            {/* Student icon - visible to lecturers, HODs, module coordinators, and admins */}
            {(isLecturerOrAdmin || isAdmin) && (
              <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
                <Link to={'/StudentDepartments'} onClick={() => setBreadcrumb('Students')}>
                  <PiStudentFill className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                  {open && <span>Students</span>}
                </Link>
              </li>
            )}
            {/* Transcript icon - visible to all users */}
            <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
              <Link to={'/module/endExam'} onClick={() => setBreadcrumb('Transcript')}>
                <MdGrading className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                {open && <span>Transcript</span>}
              </Link>
            </li>
          </ul>
        </div>
        <div className={`mb-24 flex flex-row md:flex-col gap-x-8 `}>
          <div className={`${open ? 'pl-7' : 'pl-4'} `}>
            <a href="">
               <CgProfile className={`${open ? 'mr-5' : ''} text-blue-950 inline-block w-7 h-7 m-2`} />
              {open && <span className='text-blue-950 font-semibold'>Username</span>}           
            </a>
          </div>

          <div className=''>
            <button 
              onClick={logout}
              className={`${open ? 'text-white bg-blue-950 rounded m-2 px-8 py-3 flex items-center mx-5' : 'md:w-20'} hover:shadow-primary-2 hover:scale-105 hover:outline-5 hover:outline-blue-600`}>
              <IoLogOut className={`${open ? '-ml-3 mr-5 mt-0' : 'md:ml-2 text-blue-950'} inline-block w-7 h-7 mt-2 mr-2`} />
              {open && <span className=''>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      <div className={`z-0 ${open ? 'md:ml-56' : 'md:ml-20'} flex-1 mt-12 md:mt-0`}>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
