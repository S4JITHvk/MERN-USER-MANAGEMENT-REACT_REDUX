import { Routes, Route ,Navigate} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from "react";
import {setUserData} from './redux/features/userSlice'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from './pages/Home'
import Profile from './pages/Profile'
import Admin from "./pages/Admin";

function App() {

  const dispatch = useDispatch()
  const userData = useSelector((state)=>state.user.userData)
  useEffect(() => {
    if (!userData) {
      fetch('http://localhost:3000/fetchuserdata', {
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
            return response.json();
          } else {
            throw new Error('Network response was not ok');
          }
        })
        .then((data) => {
          dispatch(setUserData(data));
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userData, dispatch]);  
  console.log(userData,"=====>userdata")
  return (
    <Routes>
        <Route path="/" element={userData && userData.data?.role === 'user' ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!userData || !userData.data ? <Login/> : userData.data.role==="admin" ? <Navigate to="/admin" /> : <Navigate to="/" />  } />
        <Route path="/signup" element={!userData || !userData.data ? <Signup/> : <Navigate to="/home" />} />
        <Route path="/home" element={userData && userData.data.role === "user" ? <Home /> : <Navigate to="/login" />}/>
        <Route path="/profile" element={userData ?userData.data.role==='user'?  <Profile />:<Navigate to="/login" /> : <Navigate to="/" />}/>
        <Route path="/admin" element={userData?.data.role==='admin'?<Admin />:<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;
