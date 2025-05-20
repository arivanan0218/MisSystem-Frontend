import React from 'react';
import logo from '../assets/img/logo.png';
import { GiRotaryPhone } from "react-icons/gi";
import { TbMailFilled } from "react-icons/tb";
import { FaRegCopyright } from "react-icons/fa";

const Footer = ({ noMargin }) => {
  return (
    <div className={`h-auto ${!noMargin ? 'mt-12' : ''}`}>
      <div className='h-[2px] bg-blue-950'></div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10 px-4 sm:px-6 lg:px-12 py-6 font-medium text-blue-950'>
        {/* Logo & Description */}
        <div className='md:col-span-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center mb-4'>
            <img src={logo} className="h-[57px] w-[41px] mr-3 mb-2 sm:mb-0" alt="University of Ruhuna Logo" />
            <div>
              <p className='font-bold text-xs'>Faculty of Engineering</p>
              <p className='text-xs'>Management Information System</p>
              <p className='text-xs'>F E M I S</p>
            </div>
          </div>
          <p className='text-xs text-justify'>
            The Faculty of Engineering of University of Ruhuna was established on 1st July 1999 at Hapugala, Galle. 
            Admission to the Faculty of Engineering, University of Ruhuna, is subject to the University Grants Commission policy on university admissions.
          </p>
        </div>

        {/* Contact */}
        <div>
          <p className='font-bold text-xs mb-2'>Contact us</p>
          <div className='text-xs'>
            <p className='mb-3'>Faculty of Engineering, University of Ruhuna, Hapugala, Galle, Sri Lanka.</p>
            <p><GiRotaryPhone className='inline-block mr-2' />Phone: +(94)0 91 2245765/6</p>
            <p><TbMailFilled className='inline-block mr-2' />E-mail: webmaster@eng.ruh.ac.lk</p>
          </div>
        </div>

        {/* Info Links */}
        <div>
          <p className='font-bold text-xs mb-2'>Info</p>
          <div className='text-xs flex flex-col gap-1'>
            <a href="https://www.ruh.ac.lk/index.php/en/" className="hover:text-blue-900 underline">University of Ruhuna</a>
            <a href="https://www.eng.ruh.ac.lk/" className="hover:text-blue-900 underline">Faculty of Engineering</a>
            <a href="https://paravi.ruh.ac.lk/foenmis/index.php" className="hover:text-blue-900 underline">ENG-MIS</a>
            <a href="https://www.lib.ruh.ac.lk/" className="hover:text-blue-900 underline">Library</a>
            <a href="https://iesl.lk/index.php?lang=en" className="hover:text-blue-900 underline">IESL</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className='text-xs flex flex-col sm:flex-row justify-center items-center py-4 border-t border-blue-950 mt-4 px-4 text-center'>
        <FaRegCopyright className='m-1' />
        <span>Faculty of Engineering, University of Ruhuna.</span>
      </div>
    </div>
  );
};

export default Footer;
