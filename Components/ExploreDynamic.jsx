import React, { useContext, useEffect, useState } from "react";
import "./ExploreDynamic.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../store/Auth";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import HeartToggle from "./HeartToggle";

const ExploreDynamic = (props) => {
  // console.log("props are: ", props);
  const { imageKey, closeModal } = props;
  // console.log("imageKey: ", imageKey);
  // console.log("closeModal: ", closeModal);
  const [open, setOpen] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [postTime, setPostTIme] = useState();
  const [inputValue, setInputValue] = useState("");

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const { token } = useContext(AuthContext);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:2000/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postedId: imageKey._id,
          comment: inputValue,
        }),
      });
      const data = await res.json();
      setPostTIme(data);
      setUserComments(data.comments);
      if (res.ok) {
        setInputValue("");
      }
      // console.log("res is:", res);
      // console.log("comment data is: ", data);
      // console.log("comment data comment is: ", data.comments);
    } catch (error) {
      console.log("handle comment in client", error);
    }
  };

  // console.log("array is: ",userComments);

  useEffect(() => {
    const syntheticEvent = { preventDefault: () => {} }; // Create a synthetic event object with a preventDefault method
    handleComment(syntheticEvent); // Pass the synthetic event to messageSent
  }, []);

  return (
    <>
      {
        // toggle &&
        <div className="expl-dynamic" id="cut-display">
          <div className="cross-cut">
            <FontAwesomeIcon
              className="cut"
              icon={faXmark}
              onClick={closeModal}
            /> 
          </div>
          <div className="expl-dynamic-box">
            <div className="expl-dynamic-box-left">
              {imageKey && <img src={imageKey.photo} alt="" />}
            </div>
            <div className="expl-dynamic-box-right">
              <div className="expl-d-header">
                <div className="profile-top-d">
                  <div className="profile-user-d">
                    <div className="profile-user-left-d d-flex align-items-center">
                      <div className="profile-all-icons">
                        {imageKey && imageKey.postedBy.profilepic!="no profile pic" ? (
                          <img
                            src={imageKey.postedBy.profilepic}
                            id="home-img"
                            alt="no-pic"
                          />
                        ) : (
                          // <FontAwesomeIcon
                          //   className="profile-user-icon-d"
                          //   icon={faCircleUser}
                          //   style={{ color: "#bfbebb" }}
                          // />
                          <img
                                  src="/images/user-img.png"
                                  width={65}
                                  height={65}
                                  className="border-0 profile-user-icon-d"
                                  alt="profile-pic"
                                />
                        )}
                      </div>
                      <div className="user-left-part-right-d">
                        <div className="user-left-part-right-1">
                          {imageKey && (
                            <h4
                              style={{ fontSize: "17px", fontWeight: "bold" }}
                            >
                              {imageKey.postedBy.fullname}
                            </h4>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="expl-d-middle">
                <div className="profile-all-icons d-flex gap-2 align-items-center mb-2 position-relative" style={{border:"1px solid #4f79a2 "}}>
                  {imageKey && imageKey.postedBy.profilepic!="no profile pic" ? (
                    <img
                      className="set-ex-photo"
                      src={imageKey.postedBy.profilepic} 
                      alt="no-pic"
                    />
                  ) : (
                    // <FontAwesomeIcon
                    //   className="profile-user-icon-d"
                    //   icon={faCircleUser}
                    //   style={{ color: "#bfbebb" }}
                    // />
                    <img
                                  src="/images/user-img.png"
                                  width={65}
                                  height={65}
                                  className="border-0 profile-user-icon-d"
                                  alt="profile-pic"
                                />
                  )}
                  <div className="user-left-part-right-d ">
                    {imageKey && (
                      <>
                        <p className="profile-name mb-0">
                          <strong>{imageKey.postedBy.fullname} </strong>{" "}
                          <span> {postTime && postTime.caption}</span>
                        </p>
                        <p className="mt-1 mb-0 time-color">
                          {postTime && moment(postTime.createdAt).fromNow()}
                        </p>
                      </>
                    )}
                  </div> 
                  <div
                    className="heart-parent"
                    style={{ position: "absolute", right: "1%" }}
                  >
                    <HeartToggle postId={imageKey._id}/>
                  </div>
                </div>
                {/* --------------------------------------------------------------------------------------- */}
                {userComments.map((e) => {
                  let smallName = e.postedBy.fullname;
                  let sName = smallName.toLowerCase().split(" ").join("");

                  return e.comment !== "" ? (
                    <div key={e._id} className="profile-user-left-d mb-2">
                      <div className="profile-all-icons">
                        <img
                          src={e.postedBy.profilepic}
                          className="comment-img"
                          alt="no-pic"
                        />
                        {/* : <FontAwesomeIcon className='profile-user-icon-d' icon={faCircleUser} style={{ color: "#bfbebb", }} /> */}
                      </div>
                      <div className="user-left-part-right-d ">
                        <div className="user-left-part-right-1">
                          {/* <h4
                            className="username-h4"
                            style={{ fontSize: "17px", fontWeight: "bold" }}
                          >
                            {sName}
                          </h4> */}

                          <p
                            className="profile-name mb-0 "
                            style={{ fontWeight: "400" }}
                          >
                            <b> {sName}</b> <span>{e.comment} </span>
                            {/* {e.comment} */}
                          </p>
                        </div>
                        <p className="mb-0 time-color mt-1">
                          {moment(e.createAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })}

                {/* ---------------------------------------------------------------------------------- */}
              </div>
              <div className="expl-d-footer">
                <form
                  method="POST"
                  className="d-flex "
                  onSubmit={handleComment}
                >
                  <input
                    type="text"
                    onChange={handleInput}
                    value={inputValue}
                    placeholder="Add a comment..."
                    id=""
                    style={{ backgroundColor: "#0E2122",color:"white" }}
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: "#0E2122", color: "white" }}
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default ExploreDynamic;
