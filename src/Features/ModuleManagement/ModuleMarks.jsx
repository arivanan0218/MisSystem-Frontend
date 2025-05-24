import React, { useState } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Breadcrumb from '../../Components/Breadcrumb';

const ModuleMarks = () => {
  const continuousAssessments = [
    { name: 'Assessment 1', marks: '04/05' },
    { name: 'Assessment 2', marks: '09/10' },
    { name: 'Assessment 3', marks: '05/05' },
    { name: 'Laboratory', marks: '19/20' },
  ];

  const endSemesterExam = { module: 'EE5351-Control System Design', result: 'A+' };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssessments = continuousAssessments.filter((assessment) =>
    assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.marks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="px-4 sm:px-6 md:px-10 lg:mx-[10%] xl:mx-[20%] font-poppins">
        {/* Search Bar */}
        <div className="py-6 ">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-md h-10 px-4 text-sm sm:text-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="px-2 sm:px-4">
          {/* Continuous Assessment Section */}
          <h1 className="text-lg sm:text-xl font-semibold text-blue-950 mb-4">Continuous Assessments Results</h1>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gray-200 font-medium">
                <tr>
                  <th className="px-4 py-2">Continuous Assessments</th>
                  <th className="px-4 py-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-blue-950 font-medium">{assessment.name}</td>
                    <td className="px-4 py-2 text-blue-950 font-medium">{assessment.marks}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">37/40</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* End Semester Section */}
          <h1 className="text-lg sm:text-xl font-semibold text-blue-950 mt-8 mb-4">End Semester Examination</h1>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Module</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-blue-950 font-medium">{endSemesterExam.module}</td>
                  <td className="px-4 py-2 text-blue-950 font-medium">{endSemesterExam.result}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleMarks;
