import React, { useContext, useEffect } from "react";
import Login from "./Login";
 import { AuthContext } from "../store/Auth";
const Logout = () => {
  const {logOutUser} = useContext(AuthContext)
  const tokenLogout = localStorage.getItem("token")
  useEffect(()=>{
    logOutUser()
  },[])
  return (
    <>
    {/* {
      tokenLogout==""
    } */}
      <Login /> 
    </>
  );
};
 
export default Logout;
