import React, { useContext, useState,useEffect } from "react";
import "./AuthRegister.css";
import { NavLink, useNavigate } from "react-router-dom"; 
// import Signup from "./Signup";
import { AuthContext } from "../store/Auth";
import { toast } from "react-toastify"; 

const AuthRegister = () => { 
  const { setTokenInLS } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:2000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, 
          password: password,
        }),
      });
      const data = await response.json();
      // console.log(data.token);
      // console.log(data.message);
      // console.log(data);
      if (data.message) {
        toast.error(data.message);
      }
      if (response.ok) {
        setEmail("");
        setPassword("");
        // localStorage.setItem("jwt", data.token)
        setTokenInLS(data.token);
        toast.success("login successful");
        navigate("/home");
      } else {
        toast.error(data[0].message);
      }
    
    } catch (error) {
      console.log("login handle submit error:", error);
      // alert(error.message)
    }
  };

  const googleLoginSubmit = () => {
    window.location.href = 'http://localhost:2000/auth/google';
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setTokenInLS(token)
      window.location.href = '/home'; // Redirect to home or dashboard
    }
  }, [])
  
 
  return (
    <>
      <div className="main">
        <div className="left">
          <img src="./images/auth (1).png" alt="auth-image" />
        </div>
        <div className="right">
          <div className="upper">
            <img src="./images/insta-logo.png" alt="insta-logo" />

            <form
              className="d-flex form-reg justify-content-center flex-column" 
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="email"
                value={email}
                className="mb-3"
                placeholder="Email"
                onChange={handleEmail}
              />
              <input
                type="password"
                name="password" 
                value={password}
                className="mb-2"
                placeholder="Password"
                onChange={handlePassword}
                autoComplete="false"
              />
              <button type="submit" className="btn mt-3">
                Log in
              </button>
            </form>

            <div className="or-line d-flex justify-content-center align-items-center">
              <div className="border-adj"></div>
              <div className="or">OR</div>
              <div className="border-adj"></div>
            </div>

            <button  className="fb d-flex justify-content-center align-items-center btn btn-info text-center" onClick={googleLoginSubmit}>
              <img src="./images/google-img.png" alt="" />
              <p className="login ">Log in with Google</p>
            </button>
            {/* <p className="text-center forgot mt-3">Forgot password?</p> */}
          </div>
          <div className="mid ">
            <p>Don't have an account?</p>
            <NavLink to="/register">
              <p className="sign-up">Sign up</p>
            </NavLink>
          </div>
          <div className="down1">
            <h4 className="text-center">Get the app.</h4>
          </div>
          <div className="down2">
            <a
              href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3DD37B8356-5397-42C9-A3AD-8D62EF9F2952%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps%3A%2F%2Fwww.google.com%2F"
              target="_main"
            >
              <img src="./images/g-play2.png" alt="google play image" />
            </a>

            <a
              href="https://apps.microsoft.com/detail/9nblggh5l9xt?hl=en-US&gl=IN"
              target="_main"
            >
              <img src="./images/microsoft.png" alt="google play image" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthRegister;
