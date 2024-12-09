import React, { lazy, useContext, useEffect, useRef, useState } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
// import { faCake } from '@fortawesome/free-solid-svg-icons'
// import { faCamera } from '@fortawesome/free-regular-svg-icons'
// import { NavLink } from "react-router-dom";
// import ExploreDynamic from './ExploreDynamic'
import { AuthContext } from "../store/Auth";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
// import { motion } from "framer-motion";
import Createpostnew from "./Createpostnew";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";
// import ImageList from "@mui/material/ImageList";
// import ImageListItem from "@mui/material/ImageListItem";
// import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
// const Createpostnew = lazy(()=>import("./Createpostnew"))
// const ExploreDynamic = lazy(()=>import("./ExploreDynamic"))

// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
const Profile = () => {
  const { token } = useContext(AuthContext);

  const [profilePost, setProfilePosts] = useState([]);

  const [profilePic, setProfilePic] = useState(null);
  const [pic, setPic] = useState(localStorage.getItem("profilepic") || "");
  // const [url, setUrl] = useState("");
  const [userData, setUserData] = useState([]);

  const [realUser, setRealUser] = useState([]);

  const [followUser, setFollowUser] = useState();
  const [unFollowUser, setUnFollowUser] = useState();
  const delPostRef = useRef();

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:2000/findloggedinuserposts", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      // console.log(data.posts);
      setProfilePosts(data.posts);
    } catch (error) {
      console.log("findloggedinuserposts error: ", error);
    }
  };

  const [cancel, setCancel] = useState(false);
  const [setting, setSetting] = useState(false);
  const [togglepost, setTogglePost] = useState(false);

  const handleCancel = () => {
    setCancel(!cancel);
  };

  const handleSetting = () => {
    setSetting(!setting);
  };

  const { logOutUser } = useContext(AuthContext);
  // console.log("useeffect before");

  const handleLogOut = () => {
    logOutUser();
    navigate("/login");
  };
  const handelInput = () => {
    document.getElementById("upload-imput-box-2").click();
  };

  const handlingtogglePost = () => {
    setTogglePost(!togglepost);
  };

  const handleProfilePic = (e) => {
    // console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file.size > 1 * 1024 * 1024) {
      toast.warning("Image should not be more than 1 MB", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        theme: "dark",
      });
    } else {
      setProfilePic(e.target.files[0]);
    }
  };

  // uploading photo to clodinary
  const uploadProfilePic = async (e) => {
    // e.preventDefault()
    const data = new FormData();
    data.append("file", profilePic);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "priyank-cloud");
    // console.log("hello priyank");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/priyank-cloud/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const resData = await res.json();
      // console.log(resData);
      // console.log("resData.url is:", resData.url);
      // alert(resData);
      if (res.ok) {
        // setUrl(resData.url)
        postPic(resData.url);
        localStorage.setItem("profilepic", resData.url);
      } else {
        // alert("Upload failed");
        toast.error("Upload failed", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log("clodinary error in upload profile pic", error);
    }
  };
  useEffect(() => {
    if (profilePic) {
      console.log("hello useefect");
      uploadProfilePic();
    }
  }, [profilePic]);

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
      if (res.ok) {
        setRealUser(data);
      }
      // console.log("real user is:",realUser);
    } catch (error) {
      console.log("verifiedUSer error", error);
    }
  };

  //uploading photo to backend
  const postPic = async (urls) => {
    try {
      const response = await fetch("http://localhost:2000/uploadPhoto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          profilephoto: urls,
        }),
      });
      const uploadPic = await response.json();
      // console.log(response);
      // console.log("uploadPic: ", uploadPic);
      if (response.ok) {
        if (uploadPic.profilepic) {
          // alert("Upload successfully");
          toast.success("Upload successfully", {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            theme: "dark",
          });
        }

        setUserData(uploadPic);

        setPic(uploadPic.profilepic);
        verifiedUSer();
        // handleSetting()
        // handleCancel()
      }
    } catch (error) {
      console.log("post pic backend error:", error);
    }
  };

  // console.log("userData is :", userData);

  const removeProfilepic = () => {
    localStorage.removeItem("profilepic");
    postPic(null);
    toast.success("Profile pic remove successfully", {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      theme: "dark",
    });
  };

  const deletePost = async (postid) => {
    try {
      const res = await fetch("http://localhost:2000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postid }),
      });
      const data = await res.json();
      console.log("deleted data is ",data);
      if (res.ok) {
        // alert(data.message);
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "dark",
        });
        fetchPosts();
      }
    } catch (error) {
      console.log("delete post client error: ", error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    verifiedUSer();
  }, []);

  const imageClicking = (key) => {
    setSelectedImage(key);
  };

  const [showModel, setShowModal] = useState(false);

  const closeModal = () => {
    return setShowModal(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isExtraSmallScreen = useMediaQuery("(max-width:400px)");

  let cols;
  if (isExtraSmallScreen) {
    cols = 1;
  } else if (isSmallScreen) {
    cols = 2;
  } else {
    cols = 3;
  }

  function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
    <>
      {cancel && (
        <div
          className="prifile-pop-up"
          id="profile-pop-up"
          style={{ position: "fixed", width: "100vw", top: "0" }}
        >
          <div className="pop-box">
            <div className="pop-box-1 pop-boxes">Change Profile Photo</div>
            <div className="pop-box-2 pop-boxes" onClick={handelInput}>
              Upload Photo
              <input
                onChange={handleProfilePic}
                type="file"
                name=""
                id="upload-imput-box-2"
              />
            </div>
            <div className="pop-box-3 pop-boxes" onClick={removeProfilepic}>
              Remove Current Photo
            </div>
            <div className="pop-box-4 pop-boxes" onClick={handleCancel}>
              Cancel
            </div>
          </div>
        </div>
      )}

      {setting && (
        <div
          className="prifile-pop-up"
          id="profile-pop-up"
          style={{ position: "fixed", width: "100vw", top: "0" }}
        >
          <div className="pop-box-new-1">
            {/* <div className="pop-box-1 pop-boxes">Change Profile Photo
    
                                </div> */}
            <div
              className="pop-box-2 pop-boxes new-p-font"
              style={{ color: "#0296F6", fontWeight: "600" }}
              onClick={handelInput}
            >
              Upload Photo
              <input
                onChange={handleProfilePic}
                type="file"
                name=""
                id="upload-imput-box-2"
              />
            </div>
            <div
              className="pop-box-3 pop-boxes new-p-font"
              style={{ color: "#ED4956", fontWeight: "600" }}
              onClick={handleLogOut}
            >
              Log out
            </div>
            <div
              className="pop-box-4 pop-boxes new-p-font"
              onClick={handleSetting}
              style={{ color: "black", fontWeight: "500" }}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
      {togglepost && <Createpostnew />}

      <div className="main-profile">
        <div className="profile-top">
          <div className="profile-user">
            <div className="profile-user-left">
              <div className="profile-all-icons" onClick={handleCancel}>
                {/* <FontAwesomeIcon className='profile-user-icon' icon={faCircleUser} style={{ color: "#bfbebb" }} /> */}
                {/* <label htmlFor="profile-file" className='label-profile'>
                                    <input type="file" accept='image/*' name="" id="profile-file" />
                                </label> */}

                {realUser.profilepic !="no profile pic" ? (
                  <img
                    className="profile-user-icon-img profile-user-icon-img-new "
                    src={realUser.profilepic}
                    alt="no-photo"
                  />
                ) : (
                  <FontAwesomeIcon
                    className="profile-user-icon"
                    icon={faCircleUser}
                    style={{ color: "#bfbebb" }}
                  />
                )}
              </div>
              <div className="user-left-part-right">
                <div className="user-left-part-right-1">
                  <h4>{realUser.username}</h4>
                  {/* <button>Follow</button> */}
                  {/* <div> */}
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleSetting}
                    className="profile-fagear-icon setting-profile-none"
                    icon={faGear}
                  />
                  {/* </div> */}
                </div>
                <div className="user-left-part-right-2">
                  <p>
                    {realUser.posts
                      ? realUser.posts.length + " posts"
                      : "0 posts"}
                  </p>
                  <p>
                    {realUser.followers
                      ? realUser.followers.length + " followers"
                      : "0 followers"}
                  </p>
                  <p>
                    {realUser.following
                      ? realUser.following.length + " following"
                      : "0 following"}
                  </p>
                </div>
                <p className="profile-name ">{realUser.fullname}</p>
              </div>
            </div>
            {/* <div className="profile-user-right"></div> */}
          </div>
        </div>

        <div className="profile-bottom">
          <div className="profile-bottom-top d-flex justify-content-center align-items-center gap-5 ">
            <div className="profile-bottom-top1 d-flex gap-2 mt-3">
              <FontAwesomeIcon
                style={{ fontSize: "2.3rem" }}
                icon={faTableCells}
              />
              <h4 style={{ fontWeight: 700, fontSize: "2rem" }}>Posts</h4>
            </div>
          </div>

          <div className="profile-bottom-down d-flex align-item-center justify-content-center mt-2 flex-column ">
            <div className="profile-post-parent ">
              {profilePost.length > 0 ? (
                profilePost.map((e, index) => {
                  return ( 
                    <>
                      <div key={index} className="prof-pa-img position-relative ">
                        <LazyLoadImage
                             alt="profile-upload-pic"
                             className="image-prof-new   "
                             height="200"
                             src={e.photo}
                             width="200px"
                             onClick={() => {
                               setShowModal(true);
                               imageClicking(e);
                             }}
                           />
                        <button className="text-white position-absolute border-0 px-2 py-1 rounded-2" style={{zIndex:4,right:"1%",top:"2%",backgroundColor:"#4C7D72"}} onClick={() => {
                            deletePost(e._id);
                          }}>Delete post</button>
                      </div>
                    </>
                  );
                })

                
              ) : (
                <>
                  <div className="p-change-margin  p-change ">
                    <div className="bottom-camera d-flex justify-content-center align-item-center mt-5">
                      <img
                        style={{ cursor: "pointer" }}
                        onClick={handlingtogglePost}
                        src="./images/camera.png"
                        alt="create-post-img"
                      />
                    </div>
                    <h2 className="text-center mt-1">Share Photos</h2>
                    <p className="text-center">
                      When you share photos, they will appear on your profile.
                    </p>
                    <p
                      style={{ cursor: "pointer", color: "#0296F6" }}
                      className="text-center"
                      onClick={handlingtogglePost}
                    >
                      Share your first photo
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
