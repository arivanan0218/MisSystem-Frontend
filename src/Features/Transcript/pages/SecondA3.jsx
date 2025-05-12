import React from 'react'
import DetailTable from '../component/DetailTable'
import SemiResults from '../component/SemiResults'

const SecondA3 = () => {
  return (
    <div className="flex justify-center items-center w-full bg-gray-100">
      <div className="w-[420mm] h-[297mm] flex justify-between bg-white shadow-lg border border-gray-300 ">
        
          {/* Left half with red background */}
          <div className="w-1/2 bg-gray-300 flex flex-col justify-start mx-[35px] mr-[50px] my-[35px]">
            <DetailTable />
            <SemiResults />
          </div>
          {/* Right half */}
          <div className="w-1/2 flex bg-gray-300 flex-col justify-start mx-[35px] mr-[50px] my-[35px]">
            <DetailTable />
            // here the semiResults should contine  
          </div>
        
      </div>
    </div>
  )
}

export default SecondA3
