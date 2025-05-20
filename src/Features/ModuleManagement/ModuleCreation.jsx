import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

const ModuleCreation = ({ closeForm, addModule, isEditing, currentModule }) => {
  const [moduleName, setModuleName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [credit, setCredit] = useState('');
  const [moduleCoordinator, setModuleCoordinator] = useState('');
  const [moduleType, setModuleType] = useState('');
  const [gpaStatus, setGpaStatus] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [error, setError] = useState(null);
  const [gpaDisabled, setGpaDisabled] = useState(false);

  useEffect(() => {
    if (isEditing && currentModule) {
      setModuleName(currentModule.moduleName);
      setModuleCode(currentModule.moduleCode);
      setCredit(currentModule.credit);
      setModuleCoordinator(currentModule.moduleCoordinator);
      setModuleType(currentModule.moduleType);
      setGpaStatus(currentModule.gpaStatus);
      setSemesterId(currentModule.semesterId);
      
      // Set GPA disabled status based on module type
      if (currentModule.moduleType === 'CM') {
        setGpaDisabled(true);
      } else {
        setGpaDisabled(false);
      }
    } else {
      const storedSemesterId = localStorage.getItem('semesterId');
      if (storedSemesterId) {
        setSemesterId(storedSemesterId);
      }
    }
  }, [isEditing, currentModule]);
  
  // Handle module type change
  useEffect(() => {
    if (moduleType === 'CM') {
      setGpaStatus('GPA');
      setGpaDisabled(true);
    } else {
      setGpaDisabled(false);
    }
  }, [moduleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const intakeId = localStorage.getItem('intakeId'); 
    const departmentId = localStorage.getItem('departmentId');

    if (moduleName.trim() && moduleCode.trim() && credit && moduleCoordinator.trim() && moduleType && gpaStatus && semesterId) {
      // Create the module object
      const moduleData = {
        semesterId,
        intakeId,
        departmentId,
        moduleName,
        moduleCode,
        credit: parseInt(credit, 10),
        moduleCoordinator,
        moduleType,
        gpaStatus,
      };

      try {
        let response;
        
        if (isEditing && currentModule) {
          // If editing, include the module ID and use PUT request
          moduleData.id = currentModule.id;
          console.log('Updating module with ID:', currentModule.id);
          response = await axios.put(`/module/${currentModule.id}`, moduleData);
          console.log('Module updated successfully:', response.data);
        } else {
          // If creating new, use POST request
          console.log('Creating new module');
          response = await axios.post('/module/create', moduleData);
          console.log('Module created successfully:', response.data);
        }
        
        addModule(response.data);
        closeForm();
      } catch (error) {
        console.error(`Error ${isEditing ? 'updating' : 'adding'} module:`, error);
        setError(`Failed to ${isEditing ? 'update' : 'add'} module. Please try again.`);
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
              htmlFor="moduleType"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              Module Type
            </label>
            <select
              id="moduleType"
              value={moduleType}
              onChange={(e) => setModuleType(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full cursor-pointer"
            >
              <option value="" disabled>Select Module Type</option>
              <option value="CM">Core Module (CM)</option>
              <option value="TE">Technical Elective (TE)</option>
              <option value="GE">General Elective (GE)</option>
            </select>
            <small className="text-gray-500 mt-1 block">
              {moduleType === 'CM' ? 'Core Modules are always GPA counted' : 
               moduleType === 'GE' ? 'General Electives can be GPA or Non-GPA' : 
               moduleType === 'TE' ? 'Technical Electives can be GPA or Non-GPA' : ''}
            </small>
          </div>
          
          <div className="mb-6">
            <label
              htmlFor="gpaStatus"
              className="block mb-2 text-blue-950 text-lg font-semibold"
            >
              GPA Status
            </label>
            <select
              id="gpaStatus"
              value={gpaStatus}
              onChange={(e) => setGpaStatus(e.target.value)}
              className={`border border-blue-950 p-2 rounded w-full ${gpaDisabled ? 'bg-gray-100' : 'cursor-pointer'}`}
              disabled={gpaDisabled}
            >
              <option value="" disabled>Select GPA Status</option>
              <option value="GPA">GPA</option>
              <option value="NGPA">Non-GPA</option>
            </select>
            {gpaDisabled && (
              <small className="text-gray-500 mt-1 block">GPA status is fixed for Core Modules</small>
            )}
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