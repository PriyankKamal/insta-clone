import React, { useState, useEffect, useContext, useRef } from "react";
import "./Createnewpost.css";
import { AuthContext } from "../store/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Createpostnew = () => {
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState();
 

  const { token } = useContext(AuthContext);

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
        setUser(data);
      }
      // console.log("real user is:",realUser);
    } catch (error) {
      console.log("verifiedUSer error", error);
    } 
  };
  useEffect(() => {
    verifiedUSer();
  }, []);

  const togglePost = () => {
    // setIsPostOpen(!isPostOpen);
    const newCreatePost = document.querySelector(".new-create-post");
    newCreatePost.style.display = "none";
    // setIsPostOpen(!isPostOpen)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 3 * 1024 * 1024) {
      toast.warning("Image should not be more than 3 MB", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        theme: "dark",
      });
      togglePost()
    } else {
      setPhoto(event.target.files[0]);
    }
  };

  // useEffect(()=>{
  //   handleFileChange()
  // })

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "priyank-cloud");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/priyank-cloud/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      // console.log("resd: ", res);

      if (res.ok) {
        const resData = await res.json();
        // console.log("resdata url ", resData.url);
        try {
          const response = await fetch("http://localhost:2000/createpost", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              caption,
              photo: resData.url,
            }),
          });
          // console.log("res: ",response)
          const createPostData = await response.json();

          // console.log("create error", createPostData);

          if (response.ok) {
            // alert("post created")
            toast.success("Post created", {
              theme: "dark",
              position: "top-right",
              autoClose: 2000,
              closeOnClick: true,
            });
            togglePost();
          }
        } catch (error) {
          console.log("sending createpost error in client", error);
        }
      }
    } catch (error) {
      console.log("image uploading error", error);
    }
  };

  const onInputClick = () => {
    document.getElementById("create-new-post-input-f").click();
  };

 

  

  return (
    <>
      {
        <div className="new-create-post container-fluid">
          {/* <button type="button" onClick={togglePost} className="btn-close  close-create-post-btn" aria-label="Close"></button> */}
          <FontAwesomeIcon
            className=" close-create-post-btn"
            onClick={togglePost}
            icon={faXmark}
          />
          <div className="new-create-post-box">
            <form onSubmit={handleSubmit}>
              <div className="new-create-post-box-1">
                {/* <div style={{ opacity: "0" }}>nonefca ef</div> */}
                {photo ? (
                  <button
                    onClick={onInputClick}
                    className="btn btn-warning rounded-2 mx-2"
                  >
                    Change Image
                  </button>
                ) : (
                  <div style={{ opacity: "0" }}>nonefca ef</div>
                )}
                <h3 className="create-post-new-h3">Create new post</h3>
                <input
                  className="new-post-box-input"
                  type="submit"
                  value="Share"
                />
              </div>
              <div className="new-create-post-box-2">
                <div className="new-create-post-box-2-1">
                  {photo ? (
                    <div className="new-img-create-post m-0 justify-content-between">
                      <img
                        className="w-100 h-100 mt-0"
                        src={URL.createObjectURL(photo)}
                        alt=""
                      />
                      <input
                        type="file"
                        id="create-new-post-input-f"
                       
                        onChange={handleFileChange}
                      />
                      {/* <button onClick={onInputClick} className="mb-2">Change Image</button> */}
                    </div>
                  ) : (
                    <div className="new-img-create-post">
                      <img src="../images/bg1.png" alt="" />
                      <p className="mb-0 fs-5">Upload photos</p>
                      <input
                        type="file"
                        id="create-new-post-input-f"
                 
                        onChange={handleFileChange}
                      />
                      <button onClick={onInputClick}>Select from device</button>
                    </div>
                  )}

                  {/* <div className="new-img-create-post">
                    {

                      photo?<img className="w-100 h-75 mt-0" src={URL.createObjectURL(photo)} alt="" /> :(
                        <>
                        <img src="../images/bg1.png" alt="" />
                      <p className="mb-0 fs-5">Drag photos and videos here</p>
                      </>
                      )

                    }
                    <input
                      type="file"
                      id="create-new-post-input-f"
                      onChange={handleFileChange}
                    />
                    <button onClick={onInputClick}>Select from computer</button>
                  </div> */}
                  {/* <img
                    src="https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt=""
                  /> */}
                </div>
                <div className="new-create-post-box-2-2">
                  <div className="new-bx-1">
                    {
                      user && user.profilepic!="no profile pic"?<img src={ user.profilepic} alt="user pic" />:<img src="/images/user-img.png"alt="user pic" />
                    }
                    {/* <img src={user && user.profilepic} alt="pk" /> */}
                    <p>{user && user.fullname}</p>
                  </div>
                  <div className="new-bx-2">
                    <textarea
                      name=""
                      id=""
                      placeholder="Write a caption..."
                      onChange={(e) => {
                        setCaption(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default Createpostnew;
