import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const SemesterCreation = ({ closeForm, addSemester, isEditing, currentSemester }) => {
  const [semesterName, setSemesterName] = useState('');
  const [semesterYear, setSemesterYear] = useState('');
  const [semesterDuration, setSemesterDuration] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && currentSemester) {
      setSemesterName(currentSemester.semesterName);
      setSemesterYear(currentSemester.semesterYear);
      setSemesterDuration(currentSemester.semesterDuration);
    }
  }, [isEditing, currentSemester]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const intakeId = localStorage.getItem('intakeId'); // Get intakeId from localStorage
    const departmentId = localStorage.getItem('departmentId');

    if (!intakeId) {
      setError('No intake selected. Please go back and select an intake.');
      return;
    }

    if (semesterName.trim() && semesterYear.trim() && semesterDuration.trim()) {
      const newSemester = {
        departmentId,
        intakeId, // Use intakeId from localStorage
        semesterName,
        semesterYear,
        semesterDuration,
      };

      try {
        let response;
        if (isEditing) {
          response = await axios.put(`/semester/${currentSemester.id}`, newSemester);
        } else {
          response = await axios.post('/semester/create', newSemester);
        }

        console.log('Response from API:', response.data);
        addSemester(response.data);
        closeForm();
      } catch (error) {
        console.error('Error adding/updating semester:', error);
        setError('Failed to add/update semester. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeForm}
    >
      <div
        className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-blue-950 text-2xl font-semibold">
          {isEditing ? 'Edit Semester' : 'Add Semester'}
        </h1>
        <form onSubmit={handleSubmit} className="m-10">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="mb-6">
            <label
              htmlFor="semesterName"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Semester Name
            </label>
            <input
              type="text"
              id="semesterName"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="semesterYear"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Semester Year
            </label>
            <input
              type="text"
              id="semesterYear"
              value={semesterYear}
              onChange={(e) => setSemesterYear(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="semesterDuration"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Duration
            </label>
            <input
              type="text"
              id="semesterDuration"
              value={semesterDuration}
              onChange={(e) => setSemesterDuration(e.target.value)}
              className="border border-blue-950 p-2 rounded w-[50%]"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeForm}
              type="button"
              className="lg:w-[155px] md:w-[75px] mr-2 px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lg:w-[155px] md:w-[75px] px-4 py-2 bg-blue-950 text-white rounded-lg"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SemesterCreation;
