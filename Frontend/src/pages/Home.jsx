import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setUserData} from '../redux/features/userSlice'
import Navbar from "../components/Navbar";
const HomeContent = () => {
  return (
    <div className="container mx-auto p-2 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-500" style={{ marginTop: "15rem" }}>Welcome to the Home Page!</h1>
    </div>
  );
};
const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
  
    fetch("http://localhost:3000/fetchuserdata", {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      credentials: "include",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); 
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        dispatch(setUserData(data)); 
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  

  return (
    <>
              <Navbar/>
            <HomeContent />
    </>
)
};

export default Home;
