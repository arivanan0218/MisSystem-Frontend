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
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex px-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='p-4'>
          <h1 className="text-xl font-semibold text-blue-950 mb-4">Continuous Assessments Results</h1>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200 font-medium">
                <tr>
                  <th className="px-4 py-2">Continuous Assessments</th>
                  <th className="px-4 py-2">Marks</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssessments.map((assessment, index) => (
                  <tr
                    key={index}
                    className={``}
                  >
                    <td className="px-4 py-2 text-blue-950 font-semi-bold">{assessment.name}</td>
                    <td className="px-4 py-2 text-blue-950 font-semi-bold">{assessment.marks}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-4 py-2 ">Total</td>
                  <td className="px-4 py-2">37/40</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h1 className="text-xl font-semibold text-blue-950 mt-8 mb-4">End Semester Examination</h1>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Module</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-blue-950 font-semi-bold">{endSemesterExam.module}</td>
                  <td className="px-4 py-2 text-blue-950 font-semi-bold">{endSemesterExam.result}</td>
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
