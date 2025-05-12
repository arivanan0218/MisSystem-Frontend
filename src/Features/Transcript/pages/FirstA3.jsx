import React from 'react';
import CoverBoard from '../component/cover/CoverBoard';
import Ins from '../component/cover/Ins';
import UniTitle from '../component/cover/UniTittle';
import StudentDetailCover from '../component/cover/StudentDetailCover';



const FirstA3 = () => {
    return (
        <div className="flex justify-center items-center w-full bg-gray-100">
          <div className="w-[420mm] h-[297mm] flex justify-between bg-white shadow-lg border border-gray-300 ">
            
              {/* Left half with red background */}
              <div className="w-1/2 bg-gray-300 flex flex-col justify-start mx-[35px] mr-[50px] my-[35px]">
                <Ins />
              </div>
              {/* Right half */}
              <div className="w-1/2 flex bg-gray-300 flex-col justify-start mx-[35px] mr-[50px] my-[35px]">
                <UniTitle />
                <CoverBoard />
                <StudentDetailCover />
                  
              </div>
            
          </div>
        </div>
      )
    }

export default FirstA3;