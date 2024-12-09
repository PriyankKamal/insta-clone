import React, { useState, useEffect, useContext } from "react";
import "./Sidebar.css";
import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
import { AuthContext } from "../store/Auth";
// import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const sidebarMove = () => {
    gsap.from(".siedbar-main", {
      x: -200,
      duration: 1,
    });
  };
  // useGSAP(()=>{

  // })
  const [query, setQuery] = useState("");
  const [user, setUser] = useState([]);
  const [person, setperson] = useState([]);
  const { token } = useContext(AuthContext);

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
    // console.log("x is: ",x);
    setperson(x);
  };

  useEffect(() => {
    if (query !== "") {
      findPerson(query);
    }
  }, [query]);
  // console.log(person.length);

  // useEffect(() => {
  //   const navlinkId = document.getElementById("navlink-id");
  //   const sidebarId = document.getElementById("sidebar-id");

  //   if(navlinkId.click){
  //     sidebarId.style.opacity = "0"
  //   }
  // },[]);

  

  useEffect(() => {
    findALlUser();
  },[]);



  // useEffect(() => {
  //   const navlinkId = document.getElementById("navlink-id");
  //   const sidebarId = document.getElementById("sidebar-id");

  //   const handleClick = () => {
  //     sidebarId.style.opacity = "0";
  //   };

  //   if (navlinkId) {
  //     navlinkId.addEventListener("click", handleClick);
  //   }

  //   // Cleanup to avoid memory leaks
  //   return () => {
  //     if (navlinkId) {
  //       navlinkId.removeEventListener("click", handleClick);
  //     }
  //   };
  // }, [])


  return (
    <>
      <div className="siedbar-main">
        <motion.div
          className="side-child1"
          id="sidebar-id"
          initial={{ opacity: 0, scaleX: 0, x: -150 }}
          animate={{ opacity: 1, scaleX: 1, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.7 }}
        >
          <div className="side-1 ">
            <h2>Search</h2>
            <form className="form " action="">
              <label htmlFor="side-search"></label>
              <input
                type="search"
                className="form-control"
                onChange={handleInputSchange}
                value={query}
                id="side-search"
                placeholder="Search"
                autoComplete="off"
              />
            </form> 
          </div>
          <div className="side-2">
            <h5>Recent</h5>

            {person.length > 0 ? (
              person.map((e) => {
                return (
                  <div key={e._id} className="side-2-p-1 d-flex gap-3 ">
                    <a
                      className="d-flex gap-3 link-underline-light"
                      id="navlink-id"
                      href={`/user/${e._id}`}
                      style={{textDecoration:"none"}}
                    >
                      <img src={e.profilepic} alt="user-pic" />
                      <div className="div-side-2-name ">
                        <p className="mb-0 side-2-c1">{e.username}</p>
                        <div className="side-2-follower d-flex gap-2">
                          <p className="mb-0 side-2-c2">{e.fullname}</p>
                          {/* <p className='side-2-c2'>256M followers</p> */}
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })
            ) : (
              <div className="no-match-found">
                <p>No recent searches.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;
