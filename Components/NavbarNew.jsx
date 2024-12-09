import React, { useState } from "react";
import "./Navbar.css";
import "./NavbarNew.css";
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import Createpostnew from "./Createpostnew";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

const Navbar = () => {
  const [value, setValue] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const togglePost = () => {
    setIsPostOpen(!isPostOpen);
  };

  // const { logOutUser } = useContext(AuthContext);
  // console.log("useeffect before");

  // const handleLogOut = () => {
  //   logOutUser();
  //   navigate("/login");
  // };

  return ( 
    <>
      {isPostOpen && <Createpostnew />}
      <div className="nav-new-bar nav ">
        {isSidebarOpen && <Sidebar />}
        <div className="nav-logo" style={{ width: "80%" }}>
          <NavLink className="navlink hide px-4" to="/">
            <img src="/images/insta-l-f.png" alt="" />
          </NavLink>
          <div className="nav-home hovering-set-nav-new hovering-set-nav text-hover d-flex align-items-center mt-6 mb-3 gap-2">
            <div className="home-logo">
              <NavLink
                //  className="navlink"
                className={({ isActive }) =>
                  isActive ? "active-link navlink-new navlink" : "navlink-new navlink "
                }
                to="/home"
              >
                <img
                  className="nav-icon-size"
                  src="/images/homee.png"
                  style={{ cursor: "pointer", height: "32px" }}
                />
              </NavLink>
            </div>
          </div>
          <div className="nav-search hovering-set-nav-new hovering-set-nav text-hover mb-3 ">
            <div className="navlink-new ">
              <div className="home-logo ">
                <img
                  src="/images/search-new.png"
                  style={{ cursor: "pointer", height: "32px" }}
                  onClick={toggleSidebar}
                  className="nav-icon-size pointer-event"
                  alt="search-img"
                />
              </div>
            </div>
          </div>
          <div className="nav-explore hovering-set-nav-new hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <div className="home-logo">
              <NavLink
                // className="navlink"
                className={({ isActive }) =>
                  isActive ? "active-link navlink-new navlink " : " navlink-new navlink"
                }
                to="/explore"
              >
                <img
                  src="/images/explore-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  className="nav-icon-size"
                />
              </NavLink>
            </div> 
          </div>

          <div className="nav-message hovering-set-nav-new hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <div className="home-logo">
              <NavLink
                to="/messages"
                //  className="navlink"
                className={({ isActive }) =>
                  isActive ? "active-link navlink-new navlink" : "navlink-new navlink"
                }
              >
                <img
                  src="/images/message-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  className="nav-icon-size"
                />
              </NavLink>
            </div>
          </div>

          <div className="nav-create hovering-set-nav-new hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <div className=" navlink-new">
              <div className="home-logo">
                <img
                  src="/images/create-new.png"
                  style={{ cursor: "pointer", height: "32px", width: "31px" }}
                  onClick={togglePost}
                  className="nav-icon-size"
                  alt="create-img"
                />
              </div>
            </div>
          </div>
          <div className="nav-profile hovering-set-nav-new hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2">
            <div className="home-logo">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "active-link navlink-new navlink" : " navlink-new navlink"
                }
                //  className="navlink"
              >
                <img
                  src="/images/user-new.png"
                  style={{ cursor: "pointer", height: "32px" }}
                  className="nav-icon-size"
                />
              </NavLink>
            </div>
          </div>
          <div className="nav-profile llogot-nav hovering-set-nav-new hovering-set-nav text-hover d-flex align-items-center mb-3 gap-2 logout-set">
            <div className="home-logo">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active-link navlink " : "navlink-new navlink"
                }
                // className="navlink"
                to="/logout"
              >
                <img
                  src="/images/logout.png"
                  className="nav-icon-size-img-logout"
                  style={{ cursor: "pointer", height: "30px" }}
                />
              </NavLink>
            </div>
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
              <NavLink
              className={({ isActive }) =>
                isActive ? "active-link navlink " : "navlink-new navlink"
              }
              // className="navlink"
              to="/logout"
            >
              <img
                src="/images/logout.png"
                className="nav-icon-size-img-logout"
                style={{ cursor: "pointer", height: "30px" }}
              />
            </NavLink>
            }
          />
        </BottomNavigation>
      </Box>

</div>
    </>
  );
};

export default Navbar;
