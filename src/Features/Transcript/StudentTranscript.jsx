
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import Transcript from './Transcript.jsx';
import axios from 'axios';

const StudentTranscript = () => {
  const [studentId, setStudentId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentExists, setStudentExists] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('Please enter a valid Student ID');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Use direct axios call to access public endpoint without auth
    axios.get(`http://13.203.223.91:8084/public/transcripts/student/reg`, {
  params: {
    studentRegNo: studentId
  }
})

      .then(response => {
        if (response.data) {
          setStudentExists(true);
          setShowPreview(true);
        } else {
          setStudentExists(false);
          setError('Student not found. Please check the ID and try again.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error checking student:', err);
        setStudentExists(false);
        setError('Failed to find student. Please check the ID and try again.');
        setLoading(false);
      });
  };

  const handleGenerateTranscript = () => {
    navigate(`/transcript?studentId=${studentId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">Student Transcript Generator</h1>
        
        {/* Input Form */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
                Student ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="studentId"
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={loading}
              />
              {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
            </div>
            <div className="flex items-center justify-center">
              <button
                className={`${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Preview Transcript'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Transcript Preview */}
      {showPreview && (
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center text-blue-900 mb-4">Transcript Preview</h2>
            
            {/* Transcript Preview Content */}
            <div className="border p-4 mb-6" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <Transcript previewMode={true} studentId={studentId} />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleGenerateTranscript}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                Generate Full Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTranscript;
