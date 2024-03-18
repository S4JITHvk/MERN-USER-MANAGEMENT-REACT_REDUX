
import React from "react";

const UserList = ({ users, openEditModal, handleDelete }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-200"></thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{user.id}</td>
            <td className="py-2 px-4 border-b">{user.name}</td>
            <td className="py-2 px-4 border-b">{user.email}</td>
            <td className="py-2 px-4 border-b">
              <button
                onClick={() => openEditModal(user.id)}
                className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-lg"
              >
                Edit User
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-2 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete User
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
