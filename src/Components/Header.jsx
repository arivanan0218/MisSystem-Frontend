import React from 'react'
import logo from '../assets/img/logo.png'


const Header = ({ noMargin }) => {
  return (
    <div className={` text-blue-950`}>
        
        <div className='flex items-center mb-3 p-2'>
        <img src={logo} className="h-[80px] w-[58px] mr-3" alt="" />
        <div className='ml-0.5'>
            <p className='font-bold text-2xl'>Faculty of Engineering</p>
            <p className='text-xs'>Management Information System</p>
            <p className='text-xs'> F E M I S</p>
        </div>
        </div>
    </div>
  )
}

export default Header