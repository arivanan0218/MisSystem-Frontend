import React, { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import IntakeCreation from './IntakeCreation';
import edit from '../../assets/img/edit.svg';
import deleteIcon from '../../assets/img/delete.svg';
import axios from '../../axiosConfig';

const Intakes = () => {
  const [intakes, setIntakes] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editingIntake, setEditingIntake] = useState(null);

  const departmentId = localStorage.getItem('departmentId');
  const userRole = localStorage.getItem('userRole');

  if (!departmentId) {
    console.error('Department ID not found in localStorage');
    setError('Department ID is missing. Please login again.');
    return null;
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
    setIntakes((prevIntakes) => Array.isArray(prevIntakes) ? [...prevIntakes, newIntake] : [newIntake]);
  };

  const handleDelete = async (intakeId) => {
    try {
      const response = await axios.delete(`/intake/${intakeId}`);
      if (!response.status === 200) throw new Error('Failed to delete intake');
      setIntakes((prevIntakes) => prevIntakes.filter((intake) => intake.id !== intakeId));
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
        if (response.status !== 200) throw new Error('Failed to update intake');
        setIntakes((prevIntakes) =>
          prevIntakes.map((intake) =>
            intake.id === updatedIntake.id ? updatedIntake : intake
          )
        );
        closeEditForm();
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
        if (response.status !== 200) throw new Error(`Failed to fetch intakes: ${response.statusText}`);
        const data = response.data;
        if (Array.isArray(data)) {
          setIntakes(data);
        } else {
          throw new Error('Unexpected data structure from API');
        }
      } catch (err) {
        console.error('Error fetching intakes:', err);
        setError('Could not fetch intakes. Please try again later.');
      }
    };
    if (departmentId) fetchIntakes();
  }, [departmentId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb breadcrumb={[
        { label: 'Home', link: '/departments' },
        { label: 'Degree Programs', link: `/departments` },
        { label: 'Intakes', link: `/departments/${departmentId}/intakes` }
      ]} />

      <div className="flex-grow px-4 sm:px-6 lg:px-20 font-poppins mr-[20%] ml-[10%]">
        <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full md:max-w-[471px] h-[41px] px-4 text-sm md:text-md"
          />
          {userRole === 'ROLE_AR' && (
            <div>
              <button
                onClick={openForm}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-full md:w-[144px] h-[41px]"
              >
                + Intake
              </button>
              {formOpen && <IntakeCreation closeForm={closeForm} addIntake={addIntake} />}
            </div>
          )}
        </div>

        <div className="mt-10">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {intakes.length > 0 ? (
            intakes.map((intake) => (
              <div key={intake.id} className="bg-white flex md:w-full justify-between items-center gap-2 mb-3">
                <Link
                  to={`${intake.id}/semesters`}
                  className="w-full md:flex-1"
                  onClick={() => localStorage.setItem('intakeId', intake.id)}
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg cursor-pointer flex justify-between items-center">
                    
                    <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis w-0 flex-1">
                      {intake.intakeYear} - {intake.batch}
                    </span>
                  </div>
                </Link>
                {userRole === 'ROLE_AR' && (
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={() => openEditForm(intake)}
                      className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg flex justify-center items-center"
                    >
                      <img src={edit} alt="edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(intake.id)}
                      className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg flex justify-center items-center"
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
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
            className="w-[90%] md:w-[75%] p-6 md:p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-xl md:text-2xl font-semibold">Edit Intake</h1>
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
                  className="border border-blue-950 p-2 rounded w-full md:w-[50%]"
                />
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-2">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="w-full md:w-[155px] text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-[150px] py-2 px-4 bg-blue-950 text-white rounded-lg"
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