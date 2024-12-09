import React, { useContext, useState, useEffect } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
// import { faCake } from "@fortawesome/free-solid-svg-icons";
// import { faCamera } from '@fortawesome/free-regular-svg-icons'
import { NavLink, useParams } from "react-router-dom";
// import ExploreDynamic from "./ExploreDynamic";
import { AuthContext } from "../store/Auth";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Createpostnew from "./Createpostnew";

const SingleUser = () => {
  const { id } = useParams();
  //   console.log("id is:👇");
  //   console.log(id);

  const { token } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const [userPosts, setUserPOsts] = useState([]);

  const [profilePost, setProfilePosts] = useState([]);

  const [profilePic, setProfilePic] = useState(null);
  const [pic, setPic] = useState(localStorage.getItem("profilepic") || "");
  // const [url, setUrl] = useState("");
  const [userData, setUserData] = useState([]);

  const [realUser, setRealUser] = useState([]);

  // const [followUser, setFollowUser] = useState();
  // const [unFollowUser, setUnFollowUser] = useState();
  const [isFollow, setIsFollow] = useState(true);

  const dynUser = async () => {
    try {
      const res = await fetch(`http://localhost:2000/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("👇👇👇👇👇👇");
      // console.log(data);
      setUser(data);
      setUserPOsts(data.posts);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    dynUser();
  }, [isFollow]);

  //   console.log("user.posts is: ", userPosts);
  //   console.log("user.length is: ", user.length);
  //   console.log("user.length is: ", user.length);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const [cancel, setCancel] = useState(false);

  const handleCancel = () => {
    setCancel(!cancel);
  };
  const handelInput = () => {
    document.getElementById("upload-imput-box-2").click();
  };
  const handleProfilePic = (e) => {
    // console.log(e.target.files[0]);
    setProfilePic(e.target.files[0]);
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
      alert(resData);
      if (res.ok) {
        // setUrl(resData.url)
        postPic(resData.url);
        localStorage.setItem("profilepic", resData.url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.log("clodinary error in upload profile pic", error);
    }
  };
  useEffect(() => {
    if (profilePic) {
      // console.log("hello useefect");
      uploadProfilePic();
    }
  }, [profilePic]);

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
      //   console.log(response);
      //   console.log(uploadPic);
      setUserData(uploadPic);
      if (response.ok) {
        alert("Upload successfully");
        setPic(uploadPic.profilepic);
      } else {
        alert("not uloaded pic");
      }
    } catch (error) {
      console.log("post pic backend error:", error);
    }
  };

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
      // console.log("real user ", data);
      setRealUser(data);
      // console.log("real user is:", realUser);
      if (data.following.includes(id)) {
        setIsFollow(true);
      }
    } catch (error) {
      console.log("verifiedUSer error", error);
    }
  };
  useEffect(() => {
    verifiedUSer();
  }, []);

  //   console.log("userData is :", userData);
  const removeProfilepic = () => {
    localStorage.removeItem("profilepic");
    postPic(null);
  };

  const [togglepost, setTogglePost] = useState(false);

  const handlingtogglePost = () => {
    setTogglePost(!togglepost);
  };

  const [setting, setSetting] = useState(false);
  const handleSetting = () => {
    setSetting(!setting);
  };

  // Follow Route

  const handleFollow = async () => {
    try {
      const res = await fetch("http://localhost:2000/follow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: id,
        }),
      });
      const data = await res.json();
      // console.log("data follow: ", data);

      if (res.ok) {
        setIsFollow(false);
      }
    } catch (error) {
      console.log("handleFollowUser: ", error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const res = await fetch("http://localhost:2000/unfollow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: id,
        }),
      });
      const data = await res.json();
      // console.log("data unfollow: ", data);
      if (res.ok) {
        setIsFollow(true);
      }
    } catch (error) {
      console.log("handleFollowUser: ", error);
    }
  };
  const { logOutUser } = useContext(AuthContext);
  // console.log("useeffect before");

  const handleLogOut = () => {
    logOutUser();
    navigate("/login");
  };
  return (
    
    <>
      {/* {cancel && (
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
      )} */}

      {/* {setting && (
        <div
          className="prifile-pop-up"
          id="profile-pop-up"
          style={{ position: "fixed", width: "100vw", top: "0" }}
        >
          <div className="pop-box-new-1">
            
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
            >
              Cancel
            </div>
          </div>
        </div>
      )} */}
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

                {user.profilepic ? (
                  <img
                    className="profile-user-icon-img profile-user-icon-img-new "
                    src={user.profilepic}
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
                  <h4>{user.username}</h4>

                  {isFollow ? (
                    <button
                      onClick={() => {
                        handleFollow();
                      }}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleUnFollow();
                      }}
                    >
                      UnFollow
                    </button>
                  )}

                  {/* <div> */}
                  {/* <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleSetting}
                    className="profile-fagear-icon"
                    icon={faGear}
                  /> */}
                  {/* </div> */}
                </div>
                <div className="user-left-part-right-2">
                  <p>{userPosts ? userPosts.length + " Posts" : "0"}</p>
                  <p>
                    {user.followers
                      ? user.followers.length + " followers"
                      : "0 followers"}
                  </p>
                  <p>
                    {user.following
                      ? user.following.length + " following"
                      : "0 following"}
                  </p>
                </div>
                <p className="profile-name ">{user.fullname}</p>
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

          <div className="profile-bottom-down d-flex align-item-center justify-content-center mt-2 flex-column">
            <div className="profile-post-parent">
              {userPosts.length > 0 ? (
                userPosts.map((e) => {
                  return (
                    <>
                      <div key={e._id} className="profile-post-img">
                          <img
                            src={e.photo}
                            alt="post pic"
                          />
                      </div>
                    </>
                  );
                })
              ) : (
                <>
                  <div className="p-change p-change-dynamic ">
                 
                    <h3 className="text-center mt-1 py-4 ">No posts</h3>
                  
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

export default SingleUser;
