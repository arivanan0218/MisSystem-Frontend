import React from 'react';

const StudentDetailCover = () => {
  return (
    <div className="p-3 w-full max-w-3xl mx-auto">
      {/* First Rectangle */}
      <div className="w-full h-48 bg-gray-300 border-2 border-black flex flex-col items-left justify-center mb-4">
        <p className="text-xl font-semibold text-black px-5 py-0.5">Full Name: Jeyapalan Povoallal</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Registration No: EG/2018/3421</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Gender: Male</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Date of Birth: 15 November 1998</p>
      </div>

      {/* Second Rectangle */}
      <div className="w-full h-52 bg-gray-300 border-2 border-black flex flex-col items-left justify-center mb-4">
        <p className="text-xl font-semibold text-black px-5 py-0.5">Degree Awarded: Bachelor of the Science of Engineering Honours</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Field of Specialization: Electrical and Information Engineering</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Effective Date: February 20, 2024</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Overall Grade Point Average: 3.35</p>
        <p className="text-xl font-semibold text-black px-5 py-0.5">Academic Standing: BScEngHons (Second Class Upper Division)</p>
      </div>

      {/* Additional Information */}
      <div className="w-full bg-gray-300 border-0 border-black flex items-left p-0">
        <p className="text-20  text-black">Medium of Instructions is English</p>
      </div>
    </div>
  );
};

export default StudentDetailCover;