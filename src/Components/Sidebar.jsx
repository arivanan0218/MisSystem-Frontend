import React, { useState } from 'react'
import { MdDashboard } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { MdGrading } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaBackward } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Sidebar = ({ children , setBreadcrumb}) => {

  const[open, setOpen] = useState(false);
  const toggle = ()=> setOpen(!open);

  return (
    <div className='flex font-poppins'>
      <div  className={`${open? ' ' : 'w-20'} h-full bg-bgSidebar font-poppins fixed top-0 left-0`}> 

        <div className={`flex  items-center mt-10  mb-10 text-blue-950 `}>
          <h1 className={`  ${open? 'text-[24px] font-bold ml-7 mr-10 duration-300' :'scale-0 ml-0 -mr-2'}`}>
            Menu
          </h1>
          <FaBackward 
          className={`cursor-pointer  transform duration-300 ${!open && 'rotate-180 mr-6 '}`} 
          onClick={toggle} 
          />
          
        </div>

        <ul className='text-blue-950 font-bold pl-7'>
            
            <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
                <Link to={'/departments'} onClick={() => setBreadcrumb('Site Home')}>
                <IoHome className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                {open && <span>Site Home</span>}
                </Link>
            </li>

            <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
                <Link to={'/departments'} onClick={() => setBreadcrumb('Lecturers')}>
                <FaChalkboardTeacher className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                {open && <span>Lecturers</span>}
                </Link>
            </li>

            <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
                <Link to={'/students'} onClick={() => setBreadcrumb('Students')}>
                <PiStudentFill className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                {open && <span>Students</span>}</Link>
            </li>

            <li className='mb-2 rounded py-2 cursor-pointer text-xl hover:text-blue-900'>
                <Link to={'/departments'} onClick={() => setBreadcrumb('Grading')}>
                <MdGrading className='inline-block w-[27px] h-6 mr-2 -mt-2'/>
                {open && <span>Grading</span>}
                </Link>
            </li>

        </ul>

        <div className={`${open? ' ' : 'w-20'}`}>
          <div className='flex justify-center mt-40'>
              <a href="">
              <CgProfile className={`${open? 'mr-5  ' : ''} text-blue-950 inline-block w-6 h-6`}/>
                {open && <span className='text-blue-950 font-semibold'>Username</span>}
                  
              </a>
          </div>

          <div className='flex justify-center mt-5'>
              <Link to={'/'}>
                <button className={`${open? 'text-white bg-blue-950 rounded m-2 px-16 py-3 flex items-center' : 'w-20'}hover:shadow-primary-2 hover:scale-105 hover:outline-5 hover:outline-blue-600`}>
                  <IoLogOut className={`${open? 'mr-2 ' : 'ml-1 text-blue-950 '}inline-block w-5 h-5 `}/>
                  {open && <span>Logout</span>}
                  
                </button>
              </Link>
          </div>
        </div>
      </div>
      <div className={`${open ? 'ml-56' : 'ml-20'} flex-1`}>
      {children}
      </div>
    </div>
  );
};

export default Sidebar