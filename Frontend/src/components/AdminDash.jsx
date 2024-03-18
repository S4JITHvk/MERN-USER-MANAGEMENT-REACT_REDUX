import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import DeleteConfirmationModal from "./DeleteConfirm";
import UserList from "./UserList";
import {
  isEmpty,
  isPasswordValid,
  isEmailValid,
} from "../../helper/validation";
import { useSelector } from "react-redux";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

const AdminDash = () => {
  const [user, setUser] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editerr, setEditerr] = useState(false);
  const [editerrdef, setEditerrdef] = useState("");
  const [open, setOpen] = useState(false);

  const usersdata = useSelector((state) => state.user.userData);
  console.log("user data:@@@@@@", usersdata.data._id);

  const [editname, setEditname] = useState({
    name: "",
    id: "",
    value: "",
    user_id: usersdata.data._id,
  });
  const [error, setError] = useState({
    emailred: false,
    namered: false,
    passwordred: false,
    confirmpasswordred: false,
  });
  const [errordef, seterrordef] = useState({
    emailerr: "",
    nameerr: "",
    passworderr: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    Password: "",
  });
  const [deluser, setDelUser] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [delid, setDelid] = useState(null);

  //add user modal
  const closeAddModal = () => {
    setNewUserData({
      name: "",
      email: "",
      Password: "",
    });
    setAddModalOpen(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const addUser = () => {
    let errors = {
      emailred: false,
      namered: false,
      passwordred: false,
      confirmpasswordred: false,
    };

    let errorMessages = {
      emailerr: "",
      nameerr: "",
      passworderr: "",
      confirmpassworderr: "",
    };

    if (isEmpty(newUserData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Email can't be empty";
    } else if (isEmailValid(newUserData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Enter a valid email";
    }
    if (isEmpty(newUserData.name)) {
      errors.namered = true;
      errorMessages.nameerr = "Name can't be empty";
    }
    if (isEmpty(newUserData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password can't be empty";
    } else if (!isPasswordValid(newUserData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password Must be Alteast 6 characters";
    }
    setError(errors);
    seterrordef(errorMessages);
    if (!errors.emailred && !errors.namered && !errors.passwordred) {
      fetch("http://localhost:3000/admin/adduser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            closeAddModal();
            fetch("http://localhost:3000/admin/fetchusertoadmin")
              .then((response) => response.json())
              .then((data) => {
                const fetchedUsers = data.data;
                const usersWithId = fetchedUsers.map((user, index) => ({
                  ...user,
                  id: index + 1,
                }));

                setUser(usersWithId);
                setIsLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setIsLoading(false);
              });
          } else if (data.error) {
            setError((previous) => ({
              ...previous,
              emailred: true,
            }));
            seterrordef((previous) => ({
              ...previous,
              emailerr: data.error,
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //edit modal
  const openEditModal = (id) => {
    const userToEdit = user.find((item) => item.id === id);
    setEditModalOpen(true);
    setEditname({
      name: userToEdit.name,
      id: userToEdit.id,
      value: userToEdit.name,
      user_id: userToEdit._id,
    });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditname("");
  };

  const editvalue = (event) => {
    const value = event.target.value;
    setEditname((previous) => ({
      ...previous,
      value: value,
    }));
  };

  //delete modal
  const handleDelete = async (id) => {
    const userToDelete = user.find((item) => item.id === id);
    setDelUser(userToDelete.name);
    setDeleteModalOpen(true);
    setDelid(id);
  };
  const handleConfirmDelete = () => {
    console.log("Deleting user with ID:", delid);
    setDeleteModalOpen(false);
    deletecred(delid);
  };

  ///delete user
  const deletecred = (id) => {
    const userToDelete = user.find((item) => item.id == id);
    fetch("http://localhost:3000/admin/deleteuser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userToDelete._id }),
    })
      .then(() => {
        fetch("http://localhost:3000/admin/fetchusertoadmin")
          .then((response) => response.json())
          .then((data) => {
            const fetchedUsers = data.data;
            const usersWithId = fetchedUsers.map((user, index) => ({
              ...user,
              id: index + 1,
            }));

            setUser(usersWithId);
            setIsLoading(false);
            setDelUser("");
            setDeleteModalOpen(false);
            setDelid(null);
          })
          .catch((err) => {
            console.error("Error fetching users after deletion:", err);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  ///edit user
  const handleEdit = () => {
    let valid = true;
    console.log(editname, "!@#$%^&*(*&^%$#");
    if (isEmpty(editname.value)) {
      valid = false;
      setEditerr(true);
      setEditerrdef("field can't be empty");
    }
    if (valid) {
      setEditerr(false);
      setEditerrdef("");
      fetch("http://localhost:3000/admin/edituser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editname),
      })
        .then(() => {
          setOpen(false);
          fetch("http://localhost:3000/admin/fetchusertoadmin")
            .then((response) => response.json())
            .then((data) => {
              const fetchedUsers = data.data;
              const usersWithId = fetchedUsers.map((user, index) => ({
                ...user,
                id: index + 1,
              }));

              setUser(usersWithId);
              setIsLoading(false);
              setEditname({
                name: "",
                id: "",
                value: "",
              });
              setEditModalOpen(false);
            })
            .catch((err) => {
              console.error("Error fetching users after deletion:", err);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch(
      `http://localhost:3000/admin/fetchusertoadmin${
        search ? `?search=${search}` : ""
      }`,
      {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedUsers = data.data;
        const usersWithId = fetchedUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));

        setUser(usersWithId);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [search]);
  return (
    <>
      <AdminNavbar
        users={user}
        setUser={setUser}
        setAddModalOpen={setAddModalOpen}
        setSearch={setSearch}
      />

      <div className="container mx-auto mt-8 p-2 max-w-2xl">
        <div className="flex justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">User Details</h2>
        </div>
        <br></br>
        <br></br>
        {isLoading ? (
          <p>Loading...</p>
        ) : user.length === 0 ? (
          <h1>No users Data...</h1>
        ) : (
          <UserList
            users={user}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
          />
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        closeEditModal={closeEditModal}
        editname={editname}
        editvalue={editvalue}
        handleEdit={handleEdit}
        editerr={editerr}
        editerrdef={editerrdef}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        newUserData={newUserData}
        handleAddChange={handleAddChange}
        addUser={addUser}
        error={error}
        errordef={errordef}
      />
    </>
  );
};

export default AdminDash;
