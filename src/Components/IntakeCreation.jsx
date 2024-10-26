import React, { useState} from 'react';
import {useParams} from 'react-router-dom'


const IntakeCreation = ({closeForm, addIntake}) => {
  const [intakeName, setIntakeName] = useState('');
  const { degreename } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (intakeName.trim()) {
      const newIntake = {
        IntakeId: Date.now(),
        IntakeName: intakeName,
        DegreeName:degreename
      };
      try {
        // Replace this URL with your actual POST endpoint
        const response = await fetch('https://localhost:7276/api/Intake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newIntake),
        });

        if (!response.ok) {
          throw new Error('Failed to add intake');
        }
        const savedIntake = await response.json();
        addIntake(savedIntake);
        closeForm();
        
      } catch (error) {
        console.error('Error adding intake:', error);
      }
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeForm}>
      <div className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950  " onClick={(e) => e.stopPropagation()}>
        <h1 className='text-blue-950 text-2xl font-semibold'>Add Intake</h1>
        <div className='m-10'>
          <form>
            <div className='mb-6'>
              <label htmlFor="intakeName" className='block mb-2 text-blue-950 text-lg font-semibold'>Intake Name</label>
              <input 
                type="text"
                id="intakeName"
                value={intakeName}
                onChange={(e) => setIntakeName(e.target.value)}
                className='border border-blue-950 p-2 rounded w-full'
              />
            </div>
            
          </form>
          <div className='flex justify-end'>
            <button onClick={closeForm} className='lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px]  border-blue-950'>
              Cancel
            </button>
            <button onClick={handleSubmit} className='lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white  rounded-lg'>
              Add
            </button>
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default IntakeCreation