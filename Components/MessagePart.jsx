import React, { useState, useEffect, useContext, useRef } from "react";
import "./Message.css";
import "./MessagePart.css"
import { AuthContext } from "../store/Auth";
// import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faL } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NavLink, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import io from "socket.io-client"
import socket from "../pages/Socket";
// const socket = lazy(()=>import("../pages/Socket"))

import moment from "moment";

// const ENDPOINT = "http://localhost:2000" 
// let socket;
// let socketUSer;

const MessagePart = () => {
  const { id } = useParams();
  // console.log("id is: ",id);
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState([]);
  const [query, setQuery] = useState("");
  const [verifuuser, setVerifuUser] = useState([]);
  const [person, setperson] = useState([]);
  // const { token } = useContext(AuthContext)
  const [toggleMessage, setToggleMessage] = useState(false);

  // const [messageUser, setMessageUser] = useState({});
  const [sendMessage, setSendMessage] = useState("");
  // const [showMsg, setShowMsg] = useState(false);

  // const [newMessage, setNewMessage] = useState([]);

  // const [seconds, setSeconds] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [hours, setHours] = useState(0);
  // const [socketConnected, setSocketConnected] = useState(false);

  const [sender, setSender] = useState([]);
  const [receiver, setReceivet] = useState([]);

  const [combinbedChat, setCombinedChat] = useState([]);
  const [senderID, setSenderID] = useState();
  const [chat, setChat] = useState();
  const [chattingPerson, setChattingPerson] = useState();

  const [clickedUserId, setClickedUserId] = useState(null);

  const scrollRef = useRef(null)

  // const [time, setTime] = useState(null);
  let lastDisplayedDate = null;

  const handleClick = (userId) => {
    setClickedUserId(userId);
  };

  const verifiedUSer = async () => {
    try {
      const res = await fetch("http://localhost:2000/user", {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("post verified user is", data);
      // setUser(data)
      setVerifuUser(data);
      // console.log("user data is hhahaha,", verifuuser.fullname);

      // console.log("real user is:", verifuuser);
    } catch (error) {
      console.log("verifiedUSer error", error);
    }
  };
  useEffect(() => {
    verifiedUSer();
  }, []);

  // socketUSer = verifuuser
  const chatPerson = async () => {
    try {
      const res = await fetch(`http://localhost:2000/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("chatPerson data: ", data);
      setChattingPerson(data);
    } catch (error) {
      console.log("chatPerson error: ", error);
    }
  };
  useEffect(() => {
    chatPerson();
  }, [id]);
  const findALlUser = async () => {
    const res = await fetch("http://localhost:2000/findalluser", {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
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
    console.log("x is: ", x);
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

  const handleInp = (e) => {
    // console.log(e.target.value);
    setSendMessage(e.target.value);
    // if(e.target.value !=""){
    //     setShowMsg(false)
    // }
  };

  const fetchMessageUSer = async () => {
    try {
      const res = await fetch(`http://localhost:2000/messageuser/${id}`, {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("fetchMessageUSer is", data);
      if (res.ok) {
        // setMessageUser(data.userExist);
        setSender(data.userExist.chats);
        setSenderID(data.userExist._id);
        setReceivet(data.chatExist);
      }
    } catch (error) {
      console.log("fetchMessageUSer error", error);
    }
  };
  useEffect(() => {
    fetchMessageUSer();
  }, [id]);

  const messageSent = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission behavior if event object is defined

      const response = await fetch(`http://localhost:2000/messageuser/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: sendMessage,
        }),
      });
      // console.log("response is:", response);
      const data = await response.json();
      // console.log("message backend data is:", data);

      // setNewMessage(data);
      // console.log("mrssage is d: ",newMessage)

      if (response.ok) {
        // setShowMsg(true);
        setSendMessage("");
        setChat(data);
        fetchMessageUSer();
      }
    } catch (error) {
      console.log("message backend error:", error); 
    }
  };

  useEffect(() => {
    chat && socket.emit("newChat", chat);

    socket.on("loadNewChat", (data) => {
      console.log("loadNewChat: ", data);
      if (data.sender === id || data.receiver === id) {
        fetchMessageUSer();
      }
    });

    return () => {
      socket.off("loadNewChat");
    };
  }, [chat]);

  useEffect(() => {
    const combined = [...sender, ...receiver].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    // console.log("combined chat: ", combined);
    setCombinedChat(combined);
  }, [sender, receiver, id]);


  useEffect(()=>{
    scrollRef.current?.scrollIntoView()
  },[combinbedChat])
  return (
    <>
      <div className="message">
        <div className="message-child">
          <div className="msgpart-display-no-no message-1 border justify-content-between ">
            <div className="m-1-1 d-flex gap-1 align-items-center justify-content-between px-3  py-2">
              <div className="d-flex gap-2 align-items-center">
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
              <p className=" fs-5 px-3 py-2 mx-2 mb-0">Messages</p> 
              <div className="w-100 scrolling-set px-2">
                {user &&
                  user.map((e) => {
                    const isClicked = clickedUserId === e._id;

                    return (
                      <div
                        key={e._id}
                        className="msg-usersend-img-name d-flex  border border-rounded rounded-2 gap-3 mt-2 text-capitalize p-1 "
                        style={{
                          backgroundColor: isClicked ? "#A59B9B" : "#FFFFFF",
                        }}
                        onClick={() => handleClick(e._id)}
                      >
                        <NavLink
                          to={`/messages/${e._id}`}
                          // className="w-100 text-decoration-none"
                          className={({ isActive }) => {
                            isActive
                              ? "active-link w-100 text-decoration-none"
                              : "w-100 text-decoration-none";
                          }}
                          style={{textDecoration:"none"}}
                        >
                          <div className="w-100 d-flex gap-3 align-items-center px-2 ">
                            {/* <img src={e.profilepic} /> */}
                            {
                              e.profilepic ?<LazyLoadImage
                              alt="profile-pic"
                              height={10}
                              src={e.profilepic} // use normal <img> attributes as props
                              width={10}
                            /> :<img src="/images/user-img.png" width={10} height={10} className="border-0" alt="profile-pic"  />
                            }
                            <p className="font-seting-msg text-black mb-0 mesg-part-part-p ">
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
       

          <form onSubmit={messageSent} method="POST" className="msg-part-fo-rm">
            <div className="msg-Parts">
              <div className="msg-Parts-child-1 ">
                {
                 chattingPerson && chattingPerson.profilepic ?<img
                  // whileHover={{ scale: 1.3 }}
                  src={chattingPerson.profilepic}
                  alt="mssg"
                />:<img
                // whileHover={{ scale: 1.3 }}
                src="/images/user-img.png"
                alt="user-mg"
              />
                }
                

                {chattingPerson && (
                  <p className="mb-0">{chattingPerson.fullname}</p>
                )}
              </div>
              <div className="msg-Parts-child-2 scrolling-set " >
                {/* {chattingPerson && (
                  <img
                    
                    transition={{ ease: "linear" }}
                    src={chattingPerson.profilepic}
                    alt="user-img"
                  />
                )} */}
                {
                 chattingPerson && chattingPerson.profilepic ?<img
                  // whileHover={{ scale: 1.3 }}
                  src={chattingPerson.profilepic}
                  alt="mssg"
                />:<img
                // whileHover={{ scale: 1.3 }}
                src="/images/user-img.png"
                alt="user-mg"
              />
                }
                
                {chattingPerson && (
                  <h4 className="mb-0">{chattingPerson.fullname}</h4>
                )}
                <NavLink to={`/user/${id}`}>
                  <button
                   
                    transition={{ ease: "linear" }}
                    className="mt-1"
                  > 
                    View profile
                  </button>
                </NavLink>
 

                <div className="scrolling w-100 px-3 pt-1 bg-chat">
                  {combinbedChat &&
                    combinbedChat.map((e) => {
                      if (e.text) {
                        const formattedDate = moment(e.createdAt).format(
                          "Do MMMM YYYY"
                        );
                        const showDate = lastDisplayedDate !== formattedDate;
                        lastDisplayedDate = formattedDate;
                        return (
                          <>
                            {showDate && 
                              <div className="text-center w-100 mb-2 ">
                               <p className="mb-0 text-secondary fw-medium">{formattedDate} </p> 
                              </div>
                            }

                            <div
                              key={e._id}
                              className={`${
                                e.sender === senderID
                                  ? "sender-text  d-flex justify-content-end mb-2  "
                                  : "receiver-text d-flex justify-content-start mb-2 "
                              }`}
                            >
                              <div className="setting-div">
                                <p 
                                  className={`${
                                    e.sender === senderID
                                      ? "text-start   fitting bg-success my-1"
                                      : "text-start  my-1 bg-danger fitting "
                                  }`}
                                  >
                                  {e.text !== "" && e.text}
                                </p>

                                  <p
                                    className={`${
                                      e.sender === senderID
                                      ? " font-span-dm mb-1 text-end text-secondary"
                                      : " text-start font-span-dm mb-1  text-secondary "
                                    }`}
                                    >
                                  {moment(e.createdAt).format("hh:mm A")}
                                </p>

                                {/* <p className="text-bg-light font-span-dm mb-0 ">{moment(e.createdAt).format("hh:mm A")}</p> */}
                              </div>
                            </div>
                          </>
                        );
                      }
                      return null;
                    })}
                </div>
                <div ref={scrollRef}/>
              </div >
              <div className="msg-Parts-child-3">
                <input
                  value={sendMessage}
                  onChange={handleInp}
                  type="text"
                  placeholder="Message..."
                />
                <button
                  type="submit"
                  className=" border px-4 py-2 rounded-5 text-white send-large-device"
                  style={{backgroundColor:"#1203f6"}}
                >
                  Send
                </button>
                <button type="submit" className="send-small-device">
                  <img src="../images/sendnew.png" alt="send" />
                  
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mesage-toggle">
        <div className="mg-box">
          <div className="msg-b-1">
            <div className="msg-child-1-1">
              <div style={{ opacity: "0" }}>non</div>
              <p style={{ lineHeight: "0" }} className="mb-0 fs-5">
                New message
              </p>
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
                    <div key={e._id} className="side-2-p-1 d-flex gap-3 "style={{textDecoration:"none"}}>
                      <NavLink
                        style={{ color: "black",textDecoration:"none" }}
                        className="d-flex gap-3 "
                        to={`/messages/${e._id}`}
                      >
                        {
                        e.profilepic?<img src={e.profilepic} alt="user-pic" />:<img
                        // whileHover={{ scale: 1.3 }}
                        src="/images/user-img.png"
                        alt="user-mg"
                      />

                        }
                        {/* <img src={e.profilepic} alt="user-pic" /> */}
                        <div className="div-side-2-name ">
                          <p className="mb-0 side-2-c1">{e.username}</p>
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

export default MessagePart;
