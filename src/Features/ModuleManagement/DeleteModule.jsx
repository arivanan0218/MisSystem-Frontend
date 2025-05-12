import React from 'react';

const DeleteModule = ({ onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-md border-[3px] border-blue-950">
        <h2 className="text-xl font-semibold text-blue-950 mb-4">Are you sure you want to delete this module?</h2>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-4 rounded-lg bg-white text-blue-950 border-[2px] border-blue-950 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-blue-950 text-white font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModule;
