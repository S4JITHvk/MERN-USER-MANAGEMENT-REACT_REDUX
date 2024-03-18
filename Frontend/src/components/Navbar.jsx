import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/features/userSlice";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const logout = () => {
    fetch('http://localhost:3000/logout/', {
  method: 'GET',
  mode: 'cors',
  redirect: 'follow',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then((response) => {
    if (response.ok) {
      dispatch(setUserData(null));
      navigate('/login');
    } else {
      console.error('Logout error:', response.statusText);
    }
  })
  .catch((error) => {
    console.error('Logout error:', error);
  });

  };
  return (
    <>
      <nav className="bg-blue-500 p-5 flex justify-between items-center">
        <div className="flex items-center">
          <input type="checkbox" id="check" className="hidden" />
          <label htmlFor="check" className="checkbtn">
            <i className="fas fa-bars text-white"></i>
          </label>
          <label className="logo text-white text-2xl font-bold ml-5">{userData.data.name}</label>
        </div>
        <div className="flex items-center space-x-5 mr-4">
          <span onClick={()=>navigate('/')} className="text-white text-xl cursor-pointer font-bold ">Home</span>
          <span onClick={()=>navigate('/profile')} className="text-white text-xl cursor-pointer font-bold ">Profile</span>
          <button onClick={logout} className="text-white text-xl cursor-pointer font-bold ">Logout</button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
