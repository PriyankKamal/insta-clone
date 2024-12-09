import React, { useContext, useEffect, useState } from "react";
import "./Homes.css";

import { AuthContext } from "../store/Auth";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";

const Homes = () => {
  // const { id } = useParams()
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState([]);
  const [loader, setLoader] = useState(true);
 
  const [verifuuser, setVerifuUser] = useState({});
  const [isFollow, setIsFollow] = useState(true);

  const verifiedUSer = async () => {
    try {
      const res = await fetch("http://localhost:2000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("post verified user is", data);
      // setUser(data)
      setVerifuUser(data);

      // if (data.following.includes(id)) {
      setIsFollow(!isFollow);
    } catch (error) {
      console.log("verifiedUSer error", error);
    }
  };

  useEffect(() => {
    verifiedUSer();
  }, []);

  const findALlUser = async () => {
    // console.log("at startinmg loader: ", loader);
    try {
      setLoader(true);
      // console.log("after startinmg loader: ", loader);
      const res = await fetch("http://localhost:2000/findalluser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("findalluser:", data);
      setUser(data);
      if (res.ok) {
        // setTimeout(() => {
        setLoader(false);
        // }, 1000);
      }
    } catch (error) {
      console.log("some error in home", error);
    }
  };
  useEffect(() => {
    findALlUser();
  }, []);

  const handleFollow = async (user) => {
    try {
      const res = await fetch("http://localhost:2000/follow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: user,
        }),
      });
      const data = await res.json();
      // console.log("data follow: ", data);

      if (res.ok) {
        verifiedUSer();
        setIsFollow(!isFollow);
      }
    } catch (error) {
      console.log("handleFollowUser: ", error);
    }
  };

  const handleUnFollow = async (user) => {
    try {
      const res = await fetch("http://localhost:2000/unfollow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: user,
        }),
      });
      const data = await res.json();
      console.log("data unfollow: ", data);
      if (res.ok) {
        verifiedUSer();
        setIsFollow(!isFollow);
      }
    } catch (error) {
      console.log("handleFollowUser: ", error);
    }
  };

  return ( 
    <>
      <div className="main-home">
        <div className="home-container">
          <div className="home-container-box">
            <h2>Suggested for you</h2>
            <div className="home-box-box1">
              {/* ------------------------------------- */}
              {user.map((e, index) => {
                return (
                  <>
                    {loader ? (
                      <div key={index+1} className="loader-home">
                        {/* <img src="./loading.gif" alt="loading" /> */}
                      {/* <Box sx={{ display: "flex" }}> */}
                        <CircularProgress />
                      {/* </Box> */}
                      </div>
                    ) : (
                      <>
                        <div key={index} className="home-c-1">
                          <NavLink
                            className="link-underline-light"
                            to={`/user/${e._id}`} 
                            style={{ textDecoration: "none" }} 
                          >
                            <div className="c-c-1"> 
                              {/* <img
                                className="border-0"
                                src={e.profilepic}
                                alt="profile-img"
                                loading="lazy"
                              /> */}

                              {e.profilepic!="no profile pic" && e.profilepic ? (
                                // <LazyLoadImage
                                //   height={55}
                                //   src={e.profilepic} 
                                //   width={55}
                                //   effect="blur"
                                // />
                                <img
                                  height={55}
                                  src={e.profilepic} 
                                  width={55}
                                  effect="blur"
                                  loading="lazy"
                                />
                              ) : (
                                <img
                                  src="/images/user-img.png"
                                  width={65}
                                  height={65}
                                  className="border-0"
                                  alt="profile-pic"
                                />
                              )}

                              <div className="home-c-b-1">
                                <p
                                  className="mb-0 text-black"
                                  style={{ fontWeight: "600" }}
                                >
                                  {e.username}
                                </p>
                                <p style={{ fontSize: "20", color: "gray" }}>
                                  {e.fullname}
                                </p>
                              </div>
                            </div>
                          </NavLink>
                        </div>

                        <div className="home-c-2" key={index + 1}>
                          {/* {follow ? ( */}
                          {verifuuser.following.includes(e._id) ? (
                            <motion.button
                              style={{
                                backgroundColor: "#EFEFEF",
                                color: "black",
                              }}
                              whileHover={{ backgroundColor: "#DBDBDB" }}
                              onClick={() => {
                                handleUnFollow(e._id);
                              }}
                            >
                              Following
                            </motion.button>
                          ) : (
                            <button
                              onClick={() => {
                                handleFollow(e._id);
                              }}
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </>
                );
              })}
              {/* // --------------------------------------------- */}

              {/* // ------------------------------------------- */}

              {/* -------------------------------------- */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homes;
