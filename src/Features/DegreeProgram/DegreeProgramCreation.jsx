import React, { useState } from 'react';
import axios from '../../axiosConfig'; // Import the axios instance

const DegreeCreation = ({ closeForm, addDegree }) => {
  const [degreeName, setDegreeName] = useState('');
  const [degreeCode, setDegreeCode] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (degreeName.trim() && degreeCode.trim()) {
      const newDegree = {
        departmentName: degreeName, // Matches the API's 'departmentName' field
        departmentCode: degreeCode, // Matches the API's 'departmentCode' field
      };

      console.log('Payload being sent to API:', newDegree); // Debugging log

      try {
        // Use axios instance to send the request with automatic token handling
        const response = await axios.post('/department/create', newDegree); 
        closeForm();
        window.location.reload();

        console.log('Response from API:', response.data); // Log the full response

        if (!response.data.departmentName || !response.data.departmentCode) {
          throw new Error('Failed to add degree: Invalid response from server');
        }

        // Update the UI with the newly added degree
        addDegree(response.data);
        
      } catch (error) {
        console.error('Error adding degree:', error);
        setError('Failed to add degree. Please try again.');
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
        <h1 className="text-blue-950 text-2xl font-semibold">Add Degree</h1>
        <div className="m-10">
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <div className="mb-6">
              <label
                htmlFor="degreeName"
                className="block mb-2 text-blue-950 text-lg font-semibold"
              >
                Degree Name
              </label>
              <input
                type="text"
                id="degreeName"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                className="border border-blue-950 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="degreeCode"
                className="block mb-2 text-blue-950 text-lg font-semibold"
              >
                Degree Code
              </label>
              <input
                type="text"
                id="degreeCode"
                value={degreeCode}
                onChange={(e) => setDegreeCode(e.target.value)}
                className="border border-blue-950 p-2 rounded w-[50%]"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeForm}
                type="button"
                className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DegreeCreation;
