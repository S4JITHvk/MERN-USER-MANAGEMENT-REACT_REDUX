
import React from "react";

const AddUserModal = ({
  isOpen,
  closeAddModal,
  newUserData,
  handleAddChange,
  addUser,
  error,
  errordef,
}) => {
  return (
    <>
       {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div
            className="bg-white p-8 rounded-lg z-10"
            style={{ width: "500px" }}
          >
            <h2 className="text-2xl font-bold mb-4">Add User</h2>

            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                name="name"
                value={newUserData.name}
                onChange={handleAddChange}
                className={`border px-4 py-2 w-full ${
                  error.namered ? "border-red-500" : ""
                }`}
              />
              {error.namered && (
                <p className="text-red-500 mt-2">{errordef.nameerr}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={newUserData.email}
                onChange={handleAddChange}
                className={`border px-4 py-2 w-full ${
                  error.emailred ? "border-red-500" : ""
                }`}
              />
              {error.emailred && (
                <p className="text-red-500 mt-2">{errordef.emailerr}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                name="Password"
                value={newUserData.Password}
                onChange={handleAddChange}
                className={`border px-4 py-2 w-full ${
                  error.passwordred ? "border-red-500" : ""
                }`}
              />
              {error.passwordred && (
                <p className="text-red-500 mt-2">{errordef.passworderr}</p>
              )}
            </div>

            <div className="flex">
              <button
                onClick={addUser}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
              >
                Add User
              </button>
              <button
                onClick={closeAddModal}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUserModal;
