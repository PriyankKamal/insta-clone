import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Signup.css";
import { toast } from "react-toastify";
import gsap from "gsap";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleFullName = (e) => {
    setFullname(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          fullname: fullname,
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      console.log(data);
      // console.log("data error: ",data[0].message)

      if (response.ok) {
        // Use callback functions for setting state to ensure re-renders
        setEmail("");
        setFullname("");
        setUsername("");
        setPassword("");
        toast.success("registration successful");
        navigate("/login");
      } else {
        toast.error(data[0].message);
      }
    } catch (error) {
      console.log("handle submit error:", error);
    }
  };
  const moveSignBox = () => {
    let registerBox = document.getElementById("reg-center-id");
    let tl = gsap.timeline();
    gsap.from(registerBox, {
      duration: 2,
      opacity: 1,
      scale: 1,
      delay: 0.4,
    });

    // moveSignBox()
  };
  useEffect(() => {
    moveSignBox();
  }, []);

  const googleLoginSubmit = () => {
    window.location.href = 'http://localhost:2000/auth/google';
  };
  return (
    <>
      <div className="main">
        <div className="reg-center" id="reg-center-id">
          <div className="insta-img">
            <img src="./images/insta-logo.png" alt="auth-image" />
          </div>
          <p className="see">
            Sign up to see photos and videos from your friends.
          </p>
          <div className="fb sign-fb btn btn-primary d-flex justify-content-center align-items-center" onClick={googleLoginSubmit}>
                        <img src="./images/google-img.png" className='reg-fb-img' alt="google image" />
                        <p className='login'>Log in with Google</p>
                    </div>
          {/* <button
            className="fb sign-fb btn btn-primary d-flex justify-content-center align-items-center"
            onClick={googleLoginSubmit}
          >
            <img src="./images/google-img.png" className="reg-fb-img" alt="google image" />
            <p className="login ">Log in with Google</p>
          </button> */}
          <div className=" d-flex justify-content-center align-items-center">
            <div className="border-adj"></div>
            <div className="or">OR</div>
            <div className="border-adj"></div>
          </div>

          <form
            method="POST"
            className="d-flex form-reg justify-content-center flex-column mt-1 px-3  mb-2  gap-1 form-regy  "
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="email"
              id=""
              className="mt-3 px-2 rounded-2 border-1 py-2"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
            <input
              type="text"
              name="fullname"
              id=""
              className="mt-2 px-2 rounded-2 border-1 py-2"
              placeholder="Full Name"
              value={fullname}
              onChange={handleFullName}
            />
            <input
              type="text"
              name="username"
              id=""
              className="mt-2 px-2 rounded-2 border-1 py-2"
              placeholder="Username"
              value={username}
              onChange={handleUsername}
            />
            <input
              type="text"
              name="password"
              id=""
              className="mt-2 px-2 rounded-2 border-1 py-2"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
            />
            <button type="submit" className="btn btn-primary mt-3 ">
              Sign up
            </button>
          </form>

          <div className="sign-mid ">
            <p>Have an account?</p>
            <NavLink to="/login">
              <p className="sign-up ">Log in</p>
            </NavLink>
          </div>
        </div> 
      </div>
    </>
  );
};

export default Signup;
