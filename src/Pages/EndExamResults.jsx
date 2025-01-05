import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Breadcrumb from '../Components/Breadcrumb';

const EndExamResults = () => {
  const moduleResults = [
    { name: 'Module 1', marks: 'A+' },
    { name: 'Module 2', marks: 'B+' },
    { name: 'Module 3', marks: 'A' },
    { name: 'Module 4', marks: 'A-' },
    { name: 'Module 5', marks: 'A+' },
    { name: 'Module 6', marks: 'A-' },
    { name: 'Module 7', marks: 'B' },
  ];

  const gradeToGPA = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0,
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Filter modules based on search input
  const filteredModules = moduleResults.filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.marks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate GPA
  const totalGPA = filteredModules.reduce((acc, module) => {
    return acc + (gradeToGPA[module.marks] || 0);
  }, 0);
  const gpa = (totalGPA / filteredModules.length).toFixed(2);

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
        <div className="p-4">
          <h1 className="text-xl font-semibold text-blue-950 mb-4">Modules and Marks</h1>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200 font-medium">
                <tr>
                  <th className="px-4 py-2">Module</th>
                  <th className="px-4 py-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((module, index) => (
                  <tr key={index} className={``}>
                    <td className="px-4 py-2 text-blue-950 font-semi-bold">{module.name}</td>
                    <td className="px-4 py-2 text-blue-950 font-semi-bold">{module.marks}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-4 py-2">GPA</td>
                  <td className="px-4 py-2">{filteredModules.length > 0 ? gpa : 'N/A'}</td>
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

export default EndExamResults;
