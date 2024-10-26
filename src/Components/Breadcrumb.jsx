import React from 'react'
import { RxSlash } from "react-icons/rx";

const Breadcrumb = ({breadcrumb}) => {
  console.log('Breadcrumb:', breadcrumb); 
  return (
    <div className='bg-gray-200 h-[40px] flex items-center'>
        <p className='ml-10'>{breadcrumb}</p><RxSlash />
    </div>
  )
}

export default Breadcrumb