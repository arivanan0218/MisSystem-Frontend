import React from "react";

const semesters = [
  {
    name: "Semester 1 (Apr 2019 - Nov 2019)",
    modules: [
      { moduleNo: "CE1101", title: "Basic Concepts in Environmental Engineering", credits: 1, grade: "B", gradePoint: 3.0 },
      { moduleNo: "CE1201", title: "Introduction to Infrastructure Planning", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "EE1101", title: "Computer Programming I", credits: 2, grade: "A-", gradePoint: 3.7 },
      { moduleNo: "EE1201", title: "Introduction to Electrical Engineering", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "ME1201", title: "Introduction to Mechanical Engineering", credits: 3, grade: "B-", gradePoint: 2.7 },
      { moduleNo: "IS1301", title: "Communication for Engineers", credits: 3, grade: "B+", gradePoint: 3.3 },
      { moduleNo: "IS1402", title: "Mathematical Fundamentals for Engineers", credits: 4, grade: "A-", gradePoint: 3.7 },
    ],
    gpa: 3.07,
  },
  {
    name: "Semester 2 (Nov 2019 - Mar 2020)",
    modules: [
      { moduleNo: "CE2201", title: "Fundamentals of Fluid Mechanics", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "EE2201", title: "Computer Programming II", credits: 3, grade: "A", gradePoint: 4.0 },
      { moduleNo: "EE2202", title: "Introduction to Electronic Engineering", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "ME2201", title: "Fundamentals of Engineering Thermodynamics", credits: 3, grade: "B", gradePoint: 3.0 },
      { moduleNo: "IS2401", title: "Linear Algebra and Differential Equations", credits: 4, grade: "B+", gradePoint: 3.3 },
    ],
    gpa: 3.14,
  },{
    name: "Semester 3 (Apr 2019 - Nov 2019)",
    modules: [
      { moduleNo: "CE1101", title: "Basic Concepts in Environmental Engineering", credits: 1, grade: "B", gradePoint: 3.0 },
      { moduleNo: "CE1201", title: "Introduction to Infrastructure Planning", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "EE1101", title: "Computer Programming I", credits: 2, grade: "A-", gradePoint: 3.7 },
      { moduleNo: "EE1201", title: "Introduction to Electrical Engineering", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "ME1201", title: "Introduction to Mechanical Engineering", credits: 3, grade: "B-", gradePoint: 2.7 },
      { moduleNo: "IS1301", title: "Communication for Engineers", credits: 3, grade: "B+", gradePoint: 3.3 },
      { moduleNo: "IS1402", title: "Mathematical Fundamentals for Engineers", credits: 4, grade: "A-", gradePoint: 3.7 },
    ],
    gpa: 3.07,
  },{
    name: "Semester 4 (Apr 2019 - Nov 2019)",
    modules: [
      { moduleNo: "CE1101", title: "Basic Concepts in Environmental Engineering", credits: 1, grade: "B", gradePoint: 3.0 },
      { moduleNo: "CE1201", title: "Introduction to Infrastructure Planning", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "EE1101", title: "Computer Programming I", credits: 2, grade: "A-", gradePoint: 3.7 },
      { moduleNo: "EE1201", title: "Introduction to Electrical Engineering", credits: 2, grade: "B", gradePoint: 3.0 },
      { moduleNo: "ME1201", title: "Introduction to Mechanical Engineering", credits: 3, grade: "B-", gradePoint: 2.7 },
      { moduleNo: "IS1301", title: "Communication for Engineers", credits: 3, grade: "B+", gradePoint: 3.3 },
      { moduleNo: "IS1402", title: "Mathematical Fundamentals for Engineers", credits: 4, grade: "A-", gradePoint: 3.7 },
    ],
    gpa: 3.07,
  },
  
];

const SemiResults = () => {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-lg font-semibold border-b border-black pb-2">
          <h2 className="text-xl font-bold text-left mb-4">Academic Transcript</h2>
          
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="border border-gray-400 px-4 py-0.25">Module No</th>
                <th className="border border-gray-400 px-4 py-0.25">Module Title</th>
                <th className="border border-gray-400 px-4 py-0.25">Credits</th>
                <th className="border border-gray-400 px-4 py-0.25">Grade</th>
                <th className="border border-gray-400 px-4 py-0.25">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((semester, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan="5" className="bg-gray-200 p-0.5 font-semibold">{semester.name}</td>
                  </tr>
                  {semester.modules.map((module, idx) => (
                    <tr key={idx} className="even:bg-gray-100">
                      <td className="border border-gray-400 px-4 py-0.25 text-center">{module.moduleNo}</td>
                      <td className="border border-gray-400 px-4 py-0.25">{module.title}</td>
                      <td className="border border-gray-400 px-4 py-0.25 text-center">{module.credits}</td>
                      <td className="border border-gray-400 px-4 py-0.25 text-center">{module.grade}</td>
                      <td className="border border-gray-400 px-4 py-0.25 text-center">{module.gradePoint}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="text-right text-sm font-semibold mt-2">
                      Semester GPA: <span className="text-blue-600">{semester.gpa}</span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

export default SemiResults;
