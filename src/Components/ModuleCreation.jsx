import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const ModuleCreation = ({ closeForm, addModule, isEditing, currentModule }) => {
  const [moduleName, setModuleName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [credit, setCredit] = useState('');
  const [moduleCoordinator, setModuleCoordinator] = useState('');
  const [gpaStatus, setGpaStatus] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && currentModule) {
      setModuleName(currentModule.moduleName);
      setModuleCode(currentModule.moduleCode);
      setCredit(currentModule.credit);
      setModuleCoordinator(currentModule.moduleCoordinator);
      setGpaStatus(currentModule.gpa_Status);
      setSemesterId(currentModule.semesterId);
    } else {
      const storedSemesterId = localStorage.getItem('semesterId');
      if (storedSemesterId) {
        setSemesterId(storedSemesterId);
      }
    }
  }, [isEditing, currentModule]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const moduleId = localStorage.getItem('moduleId'); 
    const intakeId = localStorage.getItem('intakeId'); 
    const departmentId = localStorage.getItem('departmentId');

    if (moduleName.trim() && moduleCode.trim() && credit && moduleCoordinator.trim() && gpaStatus.trim() && semesterId) {
      const newModule = {
        semesterId,
        intakeId,
        departmentId,
        moduleName,
        moduleCode,
        credit: parseInt(credit, 10),
        moduleCoordinator,
        gpa_Status: gpaStatus,
      };

      try {
        const response = await axios.post('module/create', newModule);
        addModule(response.data);
        closeForm();
      } catch (error) {
        console.error('Error adding module:', error);
        setError('Failed to add module. Please try again.');
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
          {isEditing ? 'Edit Module' : 'Add Module'}
        </h1>
        <form onSubmit={handleSubmit} className="m-10">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="mb-6">
            <label
              htmlFor="moduleName"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Module Name
            </label>
            <input
              type="text"
              id="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="moduleCode"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Module Code
            </label>
            <input
              type="text"
              id="moduleCode"
              value={moduleCode}
              onChange={(e) => setModuleCode(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="credit"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Credit
            </label>
            <input
              type="number"
              id="credit"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              className="border border-blue-950 p-2 rounded w-[50%]"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="moduleCoordinator"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Module Coordinator
            </label>
            <input
              type="text"
              id="moduleCoordinator"
              value={moduleCoordinator}
              onChange={(e) => setModuleCoordinator(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="gpaStatus"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              GPA Status
            </label>
            <input
              type="text"
              id="gpaStatus"
              value={gpaStatus}
              onChange={(e) => setGpaStatus(e.target.value)}
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

export default ModuleCreation;
