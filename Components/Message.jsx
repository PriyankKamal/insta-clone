import React, { useState, useEffect, useContext } from "react";
import "./Message.css";
import { AuthContext } from "../store/Auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import { motion } from "framer-motion";

const Message = () => {
  const { token } = useContext(AuthContext);

  // const location = useLocation();
  // const isMessageRoute = location.pathname.startsWith("/message");

  const [user, setUser] = useState([]);
  const [query, setQuery] = useState("");
  const [verifuuser, setVerifuUser] = useState({});
  const [person, setperson] = useState([]);
  // const { token } = useContext(AuthContext)
  const [toggleMessage, setToggleMessage] = useState(false);

  // const [messagePerson, setMessagePerson] = useState([]);

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
      // console.log("user data is hhahaha,", verifuuser.fullname);

      // console.log("real user is:", user);
    } catch (error) {
      console.log("verifiedUSer error", error);
    }
  };

  useEffect(() => {
    verifiedUSer();
  }, []);

  const findALlUser = async () => {
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
  };

  const handleInputSchange = (e) => {
    const search = e.target.value;
    if (search == "") {
      // console.log("search is blanked");
      setperson(search);
    }
    setQuery(search);
    // console.log("query is:",query);
  };

  const findPerson = (query) => {
    const x = user.filter((e) => {
      // console.log(e.fullname.toLowerCase().startsWith(query));
      return e.fullname.toLowerCase().startsWith(query.toLowerCase());
    });
    // console.log("x is: ", x);
    setperson(x);
  };

  useEffect(() => {
    if (query !== "") {
      findPerson(query);
    }
  }, [query]);
  // console.log(person.length);

  useEffect(() => {
    findALlUser();
  }, []);

  const toggleMsg = () => {
    const msg = document.querySelector(".mesage-toggle");
    if (msg.style.display != "none") {
      msg.style.display = "none";
      setToggleMessage(!toggleMessage);
    } else {
      msg.style.display = "block";
      setToggleMessage(!toggleMessage);
    }
  };

  //   const postedByList = user.messages.map(message => message.postedBy);
  // console.log("POSTED LIST IS: ",postedByList);

  return (
    <>
      <div className="message">
        <div className="message-child">
          {/* //this is new msg */}

          <div className="message-new-1">
            <div className="message-1 d-flex justify-content-between ">
              <div className="m-1-1 d-flex gap-1 align-items-center">
                <h3>{verifuuser.username}</h3>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>

              <div className="m-icon">
                <FontAwesomeIcon
                  onClick={toggleMsg}
                  className="message-faPen"
                  icon={faPenToSquare}
                />
              </div>
            </div>

            <div className="msg-user-send  ">
              <h5 className=" fs-5 ">Messages</h5>
              <div
                className="w-100 mt-3 overflow-y-scroll"
                style={{ height: "80vh" }}
              > 
                {user &&
                  user.map((e) => {
                    return (
                      <div
                        key={e._id}
                        className="msg-usersend-img-name d-flex border  border-rounded rounded-2 gap-3 mt-2 text-capitalize p-1 "
                      >
                        <NavLink 
                          to={`/messages/${e._id}`}
                          // className="w-100 text-decoration-none"
                          className={({ isActive }) => {
                            // { console.log(`${e.fullname} is active`,isActive)}
                            isActive
                              ? "active-link w-100 text-decoration-none"
                              : "w-100 text-decoration-none";
                          }}
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <div className="w-100 d-flex gap-3 align-items-center ">
                            {/* <img src={e.profilepic} /> */}
                            {
                              e.profilepic?<LazyLoadImage
                              alt="profile-pic"
                              height={53}
                              src={e.profilepic} // use normal <img> attributes as props
                              width={53}
                            /> :<img src="/images/user-img.png" width={53} height={53} className="border-0" alt="profile-pic"  />
                            }
                            
                            <p
                              className=" text-black mb-0 messgae-display-none"
                              style={{ fontSize: "1.2rem" }}
                            >
                              {e.fullname}
                            </p>
                          </div>
                        </NavLink>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div
            className="message-2 displ-no-npo "
            // initial={{ x: -400, opacity: 0 }}
            // animate={{ x: 0, opacity: 1 }}
            // transition={{ ease: "linear", duration: 0.5, delay: 1 }}
          >
            <div className="message-2-child">
              <img src="../images/message-img.png" alt="" />
              <h4 className="mb-0">Your messages</h4>
              <p className="mb-1">
                Send messages to a friend
              </p>
              {/* <input type="file" id="" /> */}
              <button
                // whileHover={{ scale: 1.1 }}
                // transition={{ ease: "linear" }}
                onClick={toggleMsg}
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mesage-toggle">
        <div className="mg-box">
          <div className="msg-b-1">
            <div className="msg-child-1-1">
              <div style={{ opacity: "0" }}>non</div>
              <h5 style={{ lineHeight: "0" }} className="mb-0">
                New message
              </h5>
              {/* <input className='new-post-box-input' type="submit" value="Share" /> */}
              <FontAwesomeIcon
                className="fa-x"
                onClick={toggleMsg}
                icon={faXmark}
              />
            </div>
            <div className="msg-hild-1-2">
              <p className="mb-0">To:</p>
              <input
                type="text"
                placeholder="Search..."
                onChange={handleInputSchange}
                value={query}
              />
            </div>

            <div className="msg-child-1-3">
              <p className="mb-0">No account found.</p>

              {person.length > 0 ? (
                person.map((e) => {
                  return (
                    <div key={e._id} className="side-2-p-1 d-flex gap-3 ">
                      <NavLink
                        // className="d-flex gap-3 link-underline-light"
                        className={({ isActive }) => {
                        //  { console.log(`${e.fullname} is active`,isActive)}
                          isActive
                            ? "active-link d-flex gap-3 link-underline-light"
                            : "d-flex gap-3 link-underline-light";
                        }}
                        to={`/messages/${e._id}`}
                      >
                        <img src={e.profilepic} alt="user-pic" />
                        <div className="div-side-2-name ">
                          <p
                            className="mb-0 side-2-c1"
                            style={{ color: "black" }}
                          >
                            {e.username}
                          </p>
                          <div className="side-2-follower d-flex gap-2">
                            <p className="mb-0 side-2-c2">{e.fullname}</p>
                            {/* <p className='side-2-c2'>256M followers</p> */}
                          </div>
                        </div>
                      </NavLink>
                    </div>
                  );
                })
              ) : (
                <div className="no-match-found">
                  <p>No recent searches.</p>
                </div>
              )}

              {/* ------------------------------------------------------------------------------- */}
            </div>

            <button className="msg-1-btn">Chat</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
