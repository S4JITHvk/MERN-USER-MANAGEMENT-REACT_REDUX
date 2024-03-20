import { FiUpload } from "react-icons/fi";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setUserData } from "../redux/features/userSlice";
import "react-image-crop/dist/ReactCrop.css";
import toast, { Toaster } from "react-hot-toast";
import { isEmpty, isPasswordValid } from "../../helper/validation";
import Navbar from "../components/Navbar";

export const Profile = () => {
  const [errorst, setErrorst] = useState({
    name: false,
    currentpassword: false,
    newpassword: false,
  });
  const [errdef, setErrDef] = useState({
    name: "",
    currentpassword: "",
    newpassword: "",
  });
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const userdatas = useSelector((state) => state.user.userData);
  const [selectedImage, setSelectedImage] = useState(userdatas.data.profile);
  const [userdata, SetUserdata] = useState({
    ...userdatas,
    name:"",
    currentpassword: "",
    newpassword: "",
  });
  const [viewonly, setViewonly] = useState(true);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3000/fetchuserdata", {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setUserData(data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const Cancel = () => {
    setEdit(false);
    setViewonly(true);
    SetUserdata(userdatas);
    setErrorst({
      name: false,
      currentpassword: false,
      newpassword: false,
    });
    setErrDef({
      name: "",
      currentpassword: "",
      newpassword: "",
    });
  };
  const handleChange = (event) => {
    SetUserdata((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = function () {
        setSelectedImage(e.target.result);
        setOpen(true);
        uploadImage(e.target.result);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = (selectedImage) => {
    if (selectedImage) {
      const formData = new FormData();
      fetch(selectedImage)
        .then((response) => response.blob())
        .then((blob) => {
          formData.append("profile", blob, "profile.jpg");
          return fetch("http://localhost:3000/uploadprofileimage", {
            method: "POST",
            redirect: "follow",
            mode: "cors",
            credentials: "include",
            headers: {},
            body: formData,
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload profile image");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from server:", data);
          toast.success("Profile image uploaded successfully!");
        })
        .catch((error) => {
          console.error("Error uploading profile image:", error);
        });
    }
  };
  const handleSave = async () => {
    try {
      const error = {
        name: false,
        currentpassword: false,
        newpassword: false,
      };

      const errordef = {
        name: "",
        currentpassword: "",
        newpassword: "",
      };

      let valid = true;
      if (isEmpty(userdata.data.name)) {
        valid = false;
        error.name = true;
        errordef.name = "name can't be empty";
      }
      if (userdata.currentpassword.length || userdata.newpassword.length) {
        if (isEmpty(userdata.newpassword)) {
          valid = false;
          error.newpassword = true;
          errordef.newpassword = "new password can't be empty";
        }
        if (!isPasswordValid(userdata.newpassword)) {
          valid = false;
          error.newpassword = true;
          errordef.newpassword = "password should be minimun 6 characters";
        }
        if (isEmpty(userdata.currentpassword)) {
          valid = false;
          error.currentpassword = true;
          errordef.currentpassword = "current password can't be empty";
        }
      }
      setErrorst(error);
      setErrDef(errordef);

      if (valid) {
        fetch("http://localhost:3000/editprofile", {
          method: "POST",
          mode: "cors",
          redirect: "follow",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userdata),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error, "===>");
              setErrDef((previous) => ({
                ...previous,
                currentpassword: data.error,
              }));
            } else if (data.success) {
              toast.success("Profile updated");
              setEdit(false);
              setViewonly(true);
            }
          })
          .catch((error) => {
            console.error("Error editing profile:", error);
          });

      

        fetch("http://localhost:3000/fetchuserdata", {
          method: "GET",
          mode: "cors",
          redirect: "follow",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(setUserData(data));
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-screen h-screen mt-0  bg-blue-900 flex flex-col justify-center  items-center">
        <div className="h-[90%] w-full flex justify-center items-center">
          <div className="  w-[80%] md:w-[30%] h-auto bg-white gap-4 rounded flex flex-col items-center">
            <h1 className="text-2xl font-bold">PROFILE</h1>
            <div className="h-[40%] w-full flex flex-col justify-center gap-2 items-center">
              <img
                className="h-[150px] w-[25%] border border-black rounded object-cover"
                src={selectedImage}
                alt=""
              />
              {console.log(userdata)}
              {!edit && (
                <label className="h-[13%] w-[25%] rounded border border-black flex justify-center items-center hover:bg-gray-400 hover:text-white cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <FiUpload />
                </label>
              )}
            </div>
            <TextField
              error={errorst.name}
              onChange={(e) => handleChange(e)}
              className="w-[70%]"
              id="name-input"
              label="Name"
              value={userdata.data.name}
              helperText={errdef.name}
            />
            <TextField
              className="w-[70%]"
              id="outlined-read-only-input"
              label="Email"
              defaultValue={userdata.data.email}
              InputProps={{
                readOnly: true,
              }}
            />

            {edit && (
              <>
                <TextField
                  error={errorst.currentpassword}
                  onChange={handleChange}
                  type="password"
                  name="currentpassword"
                  value={userdata.currentpassword}
                  className="w-[70%]"
                  id="current-password-input"
                  label="Current Password"
                  InputProps={{
                    readOnly: viewonly,
                  }}
                  helperText={errdef.currentpassword}
                />
                <TextField
                  error={errorst.newpassword}
                  onChange={handleChange}
                  type="password"
                  value={userdata.newpassword}
                  name="newpassword"
                  className="w-[70%]"
                  id="new-password-input"
                  label="New Password"
                  InputProps={{
                    readOnly: viewonly,
                  }}
                  helperText={errdef.newpassword}
                />
              </>
            )}

            {!edit && (
              <div className="h-[10%] w-full flex justify-end items-center pr-3 mb-2">
                <button
                  onClick={() => {
                    setEdit(true);
                    setViewonly(false);
                  }}
                  className="h-[30px] border border-black w-20 rounded hover:bg-slate-500 hover:text-white"
                >
                  Edit
                </button>
              </div>
            )}
            {edit && (
              <div className="h-[10%] w-full flex justify-end items-center pr-3 gap-5 mb-2">
                <button
                  onClick={Cancel}
                  className="h-[30px] border border-black w-20 rounded hover:bg-red-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="h-[30px] border border-black w-20 rounded hover:bg-green-500 hover:text-white"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
