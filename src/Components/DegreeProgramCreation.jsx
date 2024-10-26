import React, { useState } from 'react';

const DegreeCreation = ({ closeForm, addDegree }) => {
  const [degreeName, setDegreeName] = useState('');
  const [duration, setDuration] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (degreeName.trim() && duration.trim()) {
      const newDegree = {
        DegreeProgramId: Date.now(), // Adjust this if your backend generates IDs
        DegreeName: degreeName,
        Duration: duration,
      };
      try {
        const response = await fetch('https://localhost:7276/api/DegreeProgram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDegree),
        });

        if (!response.ok) {
          throw new Error('Failed to add degree');
        }

        const savedDegree = await response.json();

        // Update the UI with the newly added degree
        addDegree(savedDegree);
        closeForm();
      } catch (error) {
        console.error('Error adding degree:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
      <div className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950" onClick={(e) => e.stopPropagation()}>
        <h1 className='text-blue-950 text-2xl font-semibold'>Add Degree</h1>
        <div className='m-10'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label htmlFor="degreeName" className='block mb-2 text-blue-950 text-lg font-semibold'>Degree Name</label>
              <input 
                type="text"
                id="degreeName"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                className='border border-blue-950 p-2 rounded w-full'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="duration" className='block mb-2 text-blue-950 text-lg font-semibold'>Duration</label>
              <input 
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className='border border-blue-950 p-2 rounded w-[50%]'
              />
            </div>
            <div className='flex justify-end'>
              <button 
                onClick={closeForm} 
                className='lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950'
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className='lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg'
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
