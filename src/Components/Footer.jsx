import React from 'react'
import logo from '../assets/img/logo.png'
import { GiRotaryPhone } from "react-icons/gi";
import { TbMailFilled } from "react-icons/tb";
import { FaRegCopyright } from "react-icons/fa";

const Footer = ({ noMargin }) => {
  return (
    <div className={` h-250 mt-12`}>
        <div className='h-[2px] bg-blue-950'></div>
        <div className='grid grid-cols-4 m-5 gap-20 font-medium text-blue-950 mt-5 '>
            <div className='ml-2 col-span-2'>
                <div className='flex items-center mb-3 '>
                <img src={logo} className="h-[57px] w-[41px] mr-3" alt="" />
                <div>
                    <p className='font-bold text-xs'>Faculty of Engineering</p>
                    <p className='text-xs'>Management Information System</p>
                    <p className='text-xs'> F E M I S</p>
                </div>
                </div>
                <div className='text-xs text-justify mr-16'>
                The Faculty of Engineering of University of Ruhuna was established on 1st July 1999 at Hapugala, Galle.  Admission to the Faculty of Engineering, University of Ruhuna, is subject to the University Grants Commission policy on university admissions.
                </div>
            </div>
            <div>
                <p className='font-bold text-xs mb-2'>Contact us</p>
                <div className='text-xs'>
                <h6 className='mb-3'>Faculty of Engineering, University of Ruhuna, Hapugala, Galle, Sri Lanka.</h6>
                <h6><GiRotaryPhone className='inline-block mr-2' />Phone : +(94)0 91 2245765/6</h6>
                <h6><TbMailFilled className='inline-block mr-2'/>E-mail : webmaster@eng.ruh.ac.lk</h6>
                </div>
            </div>
            <div>
                <p className='font-bold text-xs mb-2' >Info</p>
                <div className='text-xs'>
                    <a href="https://www.ruh.ac.lk/index.php/en/" class=" hover:ext-blue-900 underline">University of Ruhuna</a><br/>
                    <a href="https://www.eng.ruh.ac.lk/" class=" hover:ext-blue-900 underline">Faculty of Engineering</a><br/>
                    <a href="https://paravi.ruh.ac.lk/foenmis/index.php" class=" hover:ext-blue-900 underline">ENG-MIS</a><br/>
                    <a href="https://www.lib.ruh.ac.lk/" class=" hover:ext-blue-900 underline">Library</a>
                    <a href="https://iesl.lk/index.php?lang=en" class=" hover:ext-blue-900 underline">IESL</a><br/>
                </div>
            </div>                                                              
        </div>
        <div className=' text-xs flex justify-center items-center '>
            <FaRegCopyright className='m-2' />
            <h6 className='text-center'> Faculty of Engineering, University of Ruhuna.</h6>
        </div>

    </div>
  )
}

export default Footer