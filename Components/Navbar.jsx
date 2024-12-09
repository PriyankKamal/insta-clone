import React, { useState, useContext } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import Createpostnew from "./Createpostnew";
import { AuthContext } from "../store/Auth";

import Box from "@mui/material/Box"; 
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [value, setValue] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const togglePost = () => {
    setIsPostOpen(!isPostOpen);
  };

  const { logOutUser } = useContext(AuthContext);

  const handleLogOut = () => {
    logOutUser();
    // navigate("/login");
  };

  return (
    <>
      {isPostOpen && <Createpostnew />}
      <div className="nav">
        {isSidebarOpen && <Sidebar />} 

        <div className="nav-logo">
          <NavLink className="navlink hide px-4" to="/">
            <img src="/images/insta-logo.png" alt="insta-img" />
          </NavLink>

          <div className="nav-home hovering-set-nav text-hover d-flex align-items-center mt-6 mb-3 gap-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "active-link navlink w-100 d-flex"
                  : "navlink w-100 d-flex h-100"
              }
            >
              <div className="home-logo">
                <img
                  className="nav-icon-size"
                  src="/images/homee.png"
                  style={{ cursor: "pointer", height: "32px" }}
                  alt="home-img"
                />
              </div>

              <p className="nav-font hide mb-0">Home</p>
            </NavLink>
          </div>

          <div className="nav-search hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <div className="navlink w-100 d-flex">
              <div className="home-logo">
                <img
                  src="/images/search-new.png"
                  style={{ cursor: "pointer", height: "32px" }}
                  onClick={toggleSidebar}
                  className="nav-icon-size pointer-event"
                  alt="search-img"
                />
              </div>
              <p
                className="nav-font hide mb-0 none-link"
                onClick={toggleSidebar}
              >
                Search
              </p>
            </div>
          </div>
          <div className="nav-explore hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                isActive
                  ? "active-link navlink w-100 d-flex"
                  : "navlink w-100 d-flex h-100"
              }
            >
              <div className="home-logo">
                <img
                  src="/images/explore-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  className="nav-icon-size"
                  alt="explore-img"
                />
              </div>
              <p className="nav-font hide mb-0">Explore</p>
            </NavLink>
          </div>

          <div className="nav-message hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                isActive
                  ? "active-link navlink w-100 d-flex"
                  : "navlink w-100 d-flex h-100"
              }
            >
              <div className="home-logo">
                <img
                  src="/images/message-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  className="nav-icon-size"
                  alt="message-img"
                />
              </div>

              <p className="nav-font hide mb-0">Messages</p>
            </NavLink>
          </div>

          <div className="nav-create hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <div className="navlink w-100 d-flex">
              <div className="home-logo">
                <img
                  src="/images/create-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  onClick={togglePost}
                  className="nav-icon-size"
                  alt="create-img"
                />
              </div>

              <p className="nav-font hide mb-0 none-link" onClick={togglePost}>
                Create
              </p>
            </div>
          </div>
          <div className="nav-profile hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "active-link navlink w-100 d-flex"
                  : "navlink w-100 d-flex h-100"
              }
            >
              <div className="home-logo">
                <img
                  src="/images/user-new.png"
                  style={{ cursor: "pointer", height: "32px" }}
                  className="nav-icon-size"
                  alt="profile-img"
                />
              </div>

              <p className="nav-font hide mb-0">Profile</p>
            </NavLink>
          </div>
          <div className="nav-profile llogot-nav hovering-set-nav text-hover d-flex align-items-center mt-3 gap-2 logout-set">
            <NavLink
              to="/logout"
              className={({ isActive }) => 
                isActive
                  ? "active-link navlink w-100 d-flex"
                  : "navlink w-100 d-flex h-100"
              }
            >
              <div className="home-logo">
                <img
                  src="/images/logout.png"
                  className="nav-icon-size-img-logout"
                  style={{ cursor: "pointer", height: "30px" }}
                  alt="logout-img"
                />
              </div>

              <p onClick={handleLogOut} className="nav-font hide mb-0">
                Logout
              </p>
            </NavLink>
          </div>
        </div>
      </div>

<div className="navbar-box-down">
      <Box sx={{ width: "fit-content" }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          
        >
          <BottomNavigationAction
          sx={{
            padding:"0px"
          }}

            // label="Recents"
            icon={
              <NavLink
                //  className="navlink"
                className={({ isActive }) =>
                  isActive
                    ? "active-link navlink-new navlink"
                    : "navlink-new navlink "
                }
                to="/home"
              >
                <img
                  className="nav-icon-size"
                  src="/images/homee.png"
                  style={{ cursor: "pointer", height: "32px" }}
                />
              </NavLink>
            }
          />

          <BottomNavigationAction
            // label="Favorites"
            sx={{
              padding:"0px"
            }}
            icon={
              <img
                src="/images/search-new.png"
                style={{ cursor: "pointer", height: "32px" }}
                onClick={toggleSidebar}
                className="nav-icon-size pointer-event"
                alt="search-img"
              />
            }
          />
          <BottomNavigationAction
            // label="Nearby"
            sx={{
              padding:"0px"
            }}
            icon={
              <NavLink
                // className="navlink"
                className={({ isActive }) =>
                  isActive
                    ? "active-link navlink-new navlink "
                    : " navlink-new navlink"
                }
                to="/explore"
              >
                <img
                  src="/images/explore-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  className="nav-icon-size"
                />
              </NavLink>
            }
          />

          <BottomNavigationAction
            // label="msg"
            sx={{
              padding:"0px"
            }}
            icon={
              <NavLink
                to="/messages"
                //  className="navlink"
                className={({ isActive }) =>
                  isActive
                    ? "active-link navlink-new navlink"
                    : "navlink-new navlink"
                }
              >
                <img
                  src="/images/message-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  className="nav-icon-size"
                />
              </NavLink>
            }
          />

          <BottomNavigationAction
          sx={{
            padding:"0px"
          }}
            // label="msg"
            icon={
              <img
                src="/images/create-new.png"
                style={{ cursor: "pointer", height: "32px", width: "31px" }}
                onClick={togglePost}
                className="nav-icon-size"
                alt="create-img"
              />
            }
          />

          <BottomNavigationAction
            // label="msg"
            sx={{
              padding:"0px"
            }}
            icon={
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "active-link navlink-new navlink"
                    : " navlink-new navlink"
                }
                //  className="navlink"
              >
                <img
                  src="/images/user-new.png"
                  style={{ cursor: "pointer", height: "32px" }}
                  className="nav-icon-size"
                />
              </NavLink>
            }
          />

<BottomNavigationAction
            // label="msg"
            sx={{
              padding:"0px"
            }}
            icon={
              <a
              // className={({ isActive }) =>
              //   isActive ? "active-link navlink " : "navlink-new navlink"
              // }
              // className="navlink"
              href="/logout" 
            >
              <img
                src="/images/logout.png"
                className="nav-icon-size-img-logout"
                style={{ cursor: "pointer", height: "30px" }}
              />
            </a>
            }
          />
        </BottomNavigation>
      </Box>

</div>
    </>
  );
};

export default Navbar;
