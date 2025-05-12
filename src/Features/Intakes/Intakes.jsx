

import React, { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import IntakeCreation from './IntakeCreation';  // Adjust the component name for intake creation
import edit from '../../assets/img/edit.svg';
import deleteIcon from '../../assets/img/delete.svg';
import axios from '../../axiosConfig';  // Import the axios instance

const Intakes = () => {
  const [intakes, setIntakes] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingIntake, setEditingIntake] = useState(null);

  // Get departmentId from local storage
  const departmentId = localStorage.getItem('departmentId');  // Assuming departmentId is stored with key 'departmentId'

  // Get the user role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Check if departmentId exists in localStorage
  if (!departmentId) {
    console.error('Department ID not found in localStorage');
    setError('Department ID is missing. Please login again.');
    return null;  // Optionally return null or show an error message
  }

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (intake) => {
    setEditingIntake(intake);
    setEditFormOpen(true);
  };

  const closeEditForm = () => {
    setEditingIntake(null);
    setEditFormOpen(false);
  };

  const addIntake = (newIntake) => {
    setIntakes((prevIntakes) => {
      return Array.isArray(prevIntakes) ? [...prevIntakes, newIntake] : [newIntake];
    });
  };

  const handleDelete = async (intakeId) => {
    try {
      const response = await axios.delete(`/intake/${intakeId}`);

      if (!response.status === 200) {
        throw new Error('Failed to delete intake');
      }

      // Remove the deleted intake from the state
      setIntakes((prevIntakes) =>
        prevIntakes.filter((intake) => intake.id !== intakeId)
      );
    } catch (err) {
      console.error('Error deleting intake:', err);
      setError('Could not delete intake. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { intakeYear, batch } = editingIntake;

    if (intakeYear.trim() && batch.trim()) {
      try {
        const response = await axios.put(`/intake/${editingIntake.id}`, {
          intakeYear,
          batch,
          departmentId: editingIntake.departmentId,
        });

        const updatedIntake = response.data;

        if (response.status !== 200) {
          throw new Error('Failed to update intake');
        }

        // Update the UI with the updated intake
        setIntakes((prevIntakes) =>
          prevIntakes.map((intake) =>
            intake.id === updatedIntake.id ? updatedIntake : intake
          )
        );

        closeEditForm(); // Close the edit form/modal
      } catch (error) {
        console.error('Error updating intake:', error);
        setError('Failed to update intake. Please try again.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        const response = await axios.get(`/intake/department/${departmentId}`);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch intakes: ${response.statusText}`);
        }

        const data = response.data;
        console.log('Fetched intakes:', data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setIntakes(data); // Set the intakes directly from the response
        } else {
          throw new Error('Unexpected data structure from API');
        }
      } catch (err) {
        console.error('Error fetching intakes:', err);
        setError('Could not fetch intakes. Please try again later.');
      }
    };

    if (departmentId) {
      fetchIntakes();
    }

  }, [departmentId]);  // Dependency on departmentId

  return (
    <div>
      <Header />
      <Breadcrumb breadcrumb={[
        { label: 'Home', link: '/departments' },
        { label: 'Degree Programs', link: `/departments` },
        { label: 'Intakes', link: `/departments/${departmentId}/intakes` }
      ]} />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {userRole === 'ROLE_AR' && (
            <div>
            <button
              onClick={openForm}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
              aria-label="Add Intake"
            >
              Add Intake +
            </button>
            {formOpen && <IntakeCreation closeForm={closeForm} addIntake={addIntake} />}
            
          </div>
          )}
          
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {intakes.length > 0 ? (
            intakes.map((intake) => (
              <div key={intake.id} className="bg-white flex justify-between items-center">
                    <Link to={`${intake.id}/semesters`} 
                    className="flex-1"
                    onClick={() => localStorage.setItem('intakeId', intake.id)} // Save departmentId to localStorage
                    >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {intake.intakeYear} - {intake.batch}
                  </div>
                </Link>
                {userRole === 'ROLE_AR' && (
                  <div className="flex space-x-2">
                  <div>
                    <button
                      onClick={() => openEditForm(intake)}
                      className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center"
                      aria-label="Edit Intake"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => handleDelete(intake.id)}
                      className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center"
                      aria-label="Delete Intake"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div>
                )}
                
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No intakes available.</div>
          )}
        </div>
      </div>

      {editFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeEditForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">Edit Intake</h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-6">
                <label htmlFor="intakeYear" className="block mb-2 text-blue-950 text-lg font-semibold">
                  Intake Year
                </label>
                <input
                  type="text"
                  id="intakeYear"
                  value={editingIntake?.intakeYear || ''}
                  onChange={(e) => setEditingIntake({ ...editingIntake, intakeYear: e.target.value })}
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
                  value={editingIntake?.batch || ''}
                  onChange={(e) => setEditingIntake({ ...editingIntake, batch: e.target.value })}
                  className="border border-blue-950 p-2 rounded w-[50%]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Intakes;
