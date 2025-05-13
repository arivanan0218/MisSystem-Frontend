import React, { useState } from 'react';
import axios from '../../axiosConfig'; // Import your configured Axios instance

const IntakeCreation = ({ closeForm, addIntake }) => {
  const [intakeYear, setIntakeYear] = useState('');
  const [batch, setBatch] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const departmentId = localStorage.getItem('departmentId');

    if (!departmentId) {
      setError('No department selected. Please go back and select a department.');
      return;
    }

    if (intakeYear.trim() && batch.trim()) {
      const newIntake = { intakeYear, batch, departmentId };

      try {
        const response = await axios.post('/intake/create', newIntake);

        console.log('Response from API:', response.data);
        addIntake(response.data);
        closeForm();
      } catch (error) {
        console.error('Error adding intake:', error);
        setError('Failed to add intake. Please try again.');
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
        <h1 className="text-blue-950 text-2xl font-semibold">Add Intake</h1>
        <form onSubmit={handleSubmit} className="m-10">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="mb-6">
            <label htmlFor="intakeYear" className="block mb-2 text-blue-950 text-lg font-semibold">
              Intake Year
            </label>
            <input
              type="text"
              id="intakeYear"
              value={intakeYear}
              onChange={(e) => setIntakeYear(e.target.value)}
              className="border border-blue-950 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="batch" className="block mb-2 text-blue-950 text-lg font-semibold">
              Batch
            </label>
            <input
              type="text"
              id="batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeCreation;
