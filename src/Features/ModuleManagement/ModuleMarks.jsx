import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Breadcrumb from '../../Components/Breadcrumb';
import axios from '../../axiosConfig';

const ModuleMarks = () => {
  const [continuousAssessments, setContinuousAssessments] = useState([]);
  const [endSemesterExam, setEndSemesterExam] = useState({ module: '', result: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleDetails, setModuleDetails] = useState(null);
  const [totalMarks, setTotalMarks] = useState('0/0');
  const [finalResults, setFinalResults] = useState({
    finalMarks: 0,
    grade: '',
    gradePoint: 0,
    status: ''
  });

  // Get the module ID from local storage
  const moduleId = localStorage.getItem('moduleId');
  const studentId = localStorage.getItem('studentId');
  const token = localStorage.getItem('auth-token');

  useEffect(() => {
    if (token) {
      fetchStudentMarks();
    } else {
      // Redirect to login if no token
      setError('Authentication required. Please log in again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }, [moduleId, studentId, token]);

  const fetchStudentMarks = async () => {
    if (!moduleId || !studentId) {
      setError('Required information is missing. Please go back and select a module.');
      setLoading(false);
      return;
    }
    
    // Refresh token if needed
    const currentToken = localStorage.getItem('auth-token');
    if (!currentToken) {
      setError('Authentication required. Please log in again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    try {
      // Fetch marks for the specific student
      const response = await axios.get(`/marks/student/${studentId}`);

      if (response.data && response.data.assignmentMarks) {
        // Filter marks for the current module
        const moduleMarks = response.data.assignmentMarks.filter(
          mark => mark.moduleId === parseInt(moduleId)
        );

        if (moduleMarks.length > 0) {
          // Get module name and code from localStorage or use defaults
          const moduleName = localStorage.getItem('moduleName') || `Module ${moduleId}`;
          const moduleCode = localStorage.getItem('moduleCode') || 'EE3353';
          
          // Set module details
          setModuleDetails({
            name: moduleName,
            code: moduleCode,
            departmentName: localStorage.getItem('departmentName') || 'Department',
            semesterName: localStorage.getItem('semesterName') || 'Semester',
            intakeName: localStorage.getItem('intakeName') || 'Intake'
          });

          // Format continuous assessments
          const assessments = moduleMarks.map(assignment => ({
            id: assignment.assignmentId,
            name: assignment.assignmentName,
            percentage: assignment.assignmentPercentage,
            marks: assignment.marksObtained,
            totalMarks: 100, // Maximum marks for each assignment
            weightedMarks: (assignment.marksObtained * assignment.assignmentPercentage) / 100
          }));
          setContinuousAssessments(assessments);

          // Calculate total weighted marks based on assignment percentages
          let totalWeightedMarks = 0;
          let totalPercentage = 0;
          
          moduleMarks.forEach(assignment => {
            if (assignment.assignmentPercentage > 0) {
              totalWeightedMarks += (assignment.marksObtained * assignment.assignmentPercentage) / 100;
              totalPercentage += assignment.assignmentPercentage;
            }
          });
          
          // Normalize the final marks if the total percentage doesn't add up to 100
          const finalMarks = totalPercentage > 0 
            ? (totalWeightedMarks / totalPercentage) * 100 
            : response.data.finalAssignmentMarks; // Fallback to the API value if no percentages
          
          // Set total marks display
          setTotalMarks(`${finalMarks.toFixed(2)}/100`);
          
          const grade = calculateGrade(finalMarks);
          
          setFinalResults({
            finalMarks: finalMarks,
            grade: grade,
            gradePoint: calculateGradePoint(grade),
            status: finalMarks >= 40 ? 'PASS' : 'FAIL'
          });

          setLoading(false);
        } else {
          setError('No marks found for this module.');
          setLoading(false);
        }
      } else {
        setError('No marks found for this student.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching student marks:', error);
      if (error.response && error.response.status === 401) {
        setError('Authentication failed. Please log in again.');
        // Clear token and redirect to login
        localStorage.removeItem('auth-token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Failed to fetch marks. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to filter assessments
  const filteredAssessments = useMemo(() => {
    if (!searchTerm) return continuousAssessments;
    return continuousAssessments.filter(assessment =>
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [continuousAssessments, searchTerm]);
  
  // Helper function to calculate grade from marks
  const calculateGrade = (marks, isGpa) => {
    // For GPA modules, use letter grades
    if (isGpa) {
      if (marks >= 90) return "A+";
      if (marks >= 80) return "A";
      if (marks >= 75) return "A-";
      if (marks >= 70) return "B+";
      if (marks >= 65) return "B";
      if (marks >= 60) return "B-";
      if (marks >= 55) return "C+";
      if (marks >= 50) return "C";
      if (marks >= 45) return "C-";
      if (marks >= 35) return "D+";
      if (marks >= 30) return "D";
      return "F";
    } 
    // For NGPA modules, use H/M/S grades
    else {
      if (marks >= 70) return "H";       // High
      if (marks >= 60) return "M";       // Medium
      if (marks >= 45) return "S";       // Satisfactory
      return "E";                       // Fail
    }
  };
  
  // Helper function to calculate grade point from grade
  const calculateGradePoint = (grade) => {
    switch (grade) {
      case "A+": return 4.0;
      case "A": return 4.0;
      case "A-": return 3.7;
      case "B+": return 3.3;
      case "B": return 3.0;
      case "B-": return 2.7;
      case "C+": return 2.3;
      case "C": return 2.0;
      case "C-": return 1.7;
      case "D+": return 1.3;
      case "D": return 1.0;
      default: return 0.0;
    }
  };

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="px-4 sm:px-6 md:px-10 lg:mx-[10%] xl:mx-[20%] font-poppins">
        {/* Module title only */}
        {moduleDetails && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-950 mb-2">Module Marks</h2>
          </div>
        )}
        {/* Search Bar */}
        <div className="py-6">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-md h-10 px-4 text-sm sm:text-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="px-2 sm:px-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Continuous Assessment Section */}
              <h1 className="text-lg sm:text-xl font-semibold text-blue-950 mb-4">Continuous Assessments Results</h1>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-gray-200 font-medium">
                    <tr>
                      <th className="px-4 py-2">Continuous Assessments</th>
                      <th className="px-4 py-2">Marks</th>
                      <th className="px-4 py-2">Percentage</th>
                      <th className="px-4 py-2">Weighted Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssessments.map((assessment, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-blue-950 font-medium">{assessment.name}</td>
                        <td className="px-4 py-2 text-blue-950 font-medium">{assessment.marks}/{assessment.totalMarks}</td>
                        <td className="px-4 py-2 text-blue-950 font-medium">{assessment.percentage}%</td>
                        <td className="px-4 py-2 text-blue-950 font-medium">{assessment.weightedMarks.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2">{totalMarks}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Final Result Section */}
              <h1 className="text-lg sm:text-xl font-semibold text-blue-950 mt-8 mb-4">Final Result</h1>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2">Module Code</th>
                      <th className="px-4 py-2">Final Marks</th>
                      <th className="px-4 py-2">Grade</th>
                      <th className="px-4 py-2">GPA</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-blue-950 font-medium">{moduleDetails?.code || 'N/A'}</td>
                      <td className="px-4 py-2 text-blue-950 font-medium">{finalResults.finalMarks.toFixed(2)}</td>
                      <td className="px-4 py-2 text-blue-950 font-medium">{finalResults.grade}</td>
                      <td className="px-4 py-2 text-blue-950 font-medium">{finalResults.gradePoint.toFixed(1)}</td>
                      <td className="px-4 py-2 text-blue-950 font-medium"
                          style={{ color: finalResults.status === 'PASS' ? 'green' : 'red' }}>
                        {finalResults.status}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleMarks;