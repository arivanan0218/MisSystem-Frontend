import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const AssignmentCreation = ({ closeForm, addAssignment, isEditing, currentAssignment }) => {
  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentPercentage, setAssignmentPercentage] = useState('');
  const [assignmentDuration, setAssignmentDuration] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [intakeId, setIntakeId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && currentAssignment) {
      setAssignmentName(currentAssignment.assignmentName);
      setAssignmentPercentage(currentAssignment.assignmentPercentage);
      setAssignmentDuration(currentAssignment.assignmentDuration);
      setSemesterId(currentAssignment.semester.id);
      setIntakeId(currentAssignment.intake.id);
      setDepartmentId(currentAssignment.department.id);
      setModuleId(currentAssignment.module.id);
    } else {
      const storedSemesterId = localStorage.getItem('semesterId');
      const storedIntakeId = localStorage.getItem('intakeId');
      const storedDepartmentId = localStorage.getItem('departmentId');
      const storedModuleId = localStorage.getItem('moduleId');

      if (storedSemesterId) setSemesterId(storedSemesterId);
      if (storedIntakeId) setIntakeId(storedIntakeId);
      if (storedDepartmentId) setDepartmentId(storedDepartmentId);
      if (storedModuleId) setModuleId(storedModuleId);
    }
  }, [isEditing, currentAssignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const moduleId = localStorage.getItem('moduleId'); 
    const intakeId = localStorage.getItem('intakeId'); 
    const departmentId = localStorage.getItem('departmentId');
    const assignmentId = localStorage.getItem('assignmentId');

    if (assignmentName.trim() &&assignmentPercentage &&assignmentDuration.trim() &&moduleId) {
      const newAssignment = {
        assignmentId,
        semesterId,
        intakeId,
        departmentId,
        moduleId,
        assignmentName,
        assignmentPercentage: parseInt(assignmentPercentage, 10),
        assignmentDuration,
      };

      try {
        const response = await axios.post('assignment/create', newAssignment);
        addAssignment(response.data);
        closeForm();
      } catch (error) {
        console.error('Error adding assignment:', error);
        setError('Failed to add assignment. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto"
      onClick={closeForm}
    >
      <div
        className="w-[75%] max-h-[90%] overflow-y-auto p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-blue-950 text-2xl font-semibold">
          {isEditing ? 'Edit Assignment' : 'Add Assignment'}
        </h1>
        <form onSubmit={handleSubmit} className="m-10">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="mb-6">
            <label
              htmlFor="assignmentName"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Assignment Name
            </label>
            <input
              type="text"
              id="assignmentName"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="assignmentPercentage"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Assignment Percentage
            </label>
            <input
              type="number"
              id="assignmentPercentage"
              value={assignmentPercentage}
              onChange={(e) => setAssignmentPercentage(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="assignmentDuration"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Assignment Duration
            </label>
            <input
              type="text"
              id="assignmentDuration"
              value={assignmentDuration}
              onChange={(e) => setAssignmentDuration(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="semesterId"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Semester ID
            </label>
            <input
              type="number"
              id="semesterId"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              className={`border p-2 rounded w-[50%] ${localStorage.getItem('semesterId') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              readOnly={!!localStorage.getItem('semesterId')}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="intakeId"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Intake ID
            </label>
            <input
              type="number"
              id="intakeId"
              value={intakeId}
              onChange={(e) => setIntakeId(e.target.value)}
              className={`border p-2 rounded w-[50%] ${localStorage.getItem('intakeId') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              readOnly={!!localStorage.getItem('intakeId')}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="departmentId"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Department ID
            </label>
            <input
              type="number"
              id="departmentId"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className={`border p-2 rounded w-[50%] ${localStorage.getItem('departmentId') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              readOnly={!!localStorage.getItem('departmentId')}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="moduleId"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Module ID
            </label>
            <input
              type="number"
              id="moduleId"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className={`border p-2 rounded w-[50%] ${localStorage.getItem('moduleId') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              readOnly={!!localStorage.getItem('moduleId')}
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

export default AssignmentCreation;
