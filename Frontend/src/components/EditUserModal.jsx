
import React from "react";

const EditUserModal = ({
  isOpen,
  closeEditModal,
  editname,
  editvalue,
  handleEdit,
  editerr,
  editerrdef,
}) => {
  return (
    <>
        {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="bg-white p-8 rounded-lg z-10 ">
            <h2 className="text-2xl font-bold mb-4">Edit User Name</h2>
            <label className="block mb-2">New Name:</label>
            <input
              type="text"
              value={editname.value}
              onChange={editvalue}
              className="border px-4 py-2 mb-4 mr-3"
            />
            {editerr && <p className="text-red-500 mb-2">{editerrdef}</p>}
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={closeEditModal}
              className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUserModal;
