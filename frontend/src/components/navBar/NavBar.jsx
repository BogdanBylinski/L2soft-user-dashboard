import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import { ReactComponent as Close } from "../../assets/close.svg";
import { ReactComponent as Burger } from "../../assets/burger.svg";
import Logo from "../../assets/Logo.svg";
import { ReactComponent as Logout } from "../../assets/logout.svg";
import { ReactComponent as ListIcon } from "../../assets/keys.svg";
import { ReactComponent as ProfileIcon } from "../../assets/profile.svg";
import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as Cart } from "../../assets/cart.svg";
import { ReactComponent as Left } from "../../assets/left.svg";
import { ReactComponent as Right } from "../../assets/right.svg";
import { ReactComponent as Settings } from "../../assets/settings.svg";
import { useState, useEffect, useLayoutEffect } from "react";
import SideBar from "./SideBar";
import {
  DELETE_KEYS,
  logout,
  RESET,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useRedirectNotVerified from "../customHook/useRedirectNotVerified";
import useRedirecLoggedOutUser from "../customHook/useRedirecLoggedOutUser";
import { DELETE_FILTERED_KEYS } from "../../redux/features/auth/filterSlice";
const NavBar = ({ children }) => {
  const [navBarActive, setNavBarActive] = useState(false);
  const [navBarSize, setNavBarSize] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useRedirecLoggedOutUser("/login");
  const changeNavbarSize = () => {
    console.log(navBarSize);
    if (navBarSize === "small") {
      localStorage.setItem("navBarSize", "opened");
      setNavBarSize("opened");
    } else {
      localStorage.setItem("navBarSize", "small");
      setNavBarSize("small");
    }
  };
  const logoutUser = async () => {
    dispatch(RESET());
    dispatch(DELETE_KEYS());
    dispatch(DELETE_FILTERED_KEYS());
    await dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    const size = localStorage.getItem("navBarSize");
    setNavBarSize(size);
  }, []);
  if (!user) {
    return <></>;
  }
  return (
    <>
      <nav className={`navBar ${navBarSize}`}>
        <div className="navBar__slider">
          <button onClick={() => changeNavbarSize()}>
            {navBarSize === "small" ? <Right /> : <Left />}
          </button>
        </div>
        <div className="navBar__item">
          <div className="navBar__item-header">
            <NavLink to={"/"}>
              <img src={Logo} alt="logo" />
            </NavLink>
          </div>
        </div>
        <div className="navBar__item flex-grow">
          <div className="navBar__item-links ">
            <ul>
              {/* <li>
                <NavLink to={"/"}>
                  <ProfileIcon />
                  <p>Profile</p>
                </NavLink>
              </li> */}
              <li>
                <NavLink to={"/"}>
                  <ListIcon />
                  <p>Keys</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/settings"}>
                  <Settings />
                  <p>Settings</p>
                </NavLink>
              </li>
              {user && user.role === "admin" ? (
                <li>
                  <NavLink to={"/controlPanel"}>
                    <Settings />
                    <p>Admin panel</p>
                  </NavLink>
                </li>
              ) : (
                ""
              )}

              <hr></hr>
              <li>
                <a href="#">
                  <Cart />
                  <p>Purchase key</p>
                </a>
              </li>
              <li>
                <a href="#">
                  <HomeIcon />
                  <p>Main page</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navBar__item">
          <div className="navBar__item-profile">
            <button onClick={logoutUser}>
              <Logout />
              <p>Logout</p>
            </button>
          </div>
        </div>
        <div className="navBar__item">
          <div className="navBar__item-burger">
            <button onClick={logoutUser}>
              <Logout />
              <p>Logout</p>
            </button>
          </div>
          <div className="navBar__item-burger">
            <button onClick={() => setNavBarActive(!navBarActive)}>
              {navBarActive ? <Close /> : <Burger />}
            </button>
          </div>
        </div>
      </nav>
      <SideBar
        navBarActive={navBarActive}
        setNavBarActive={setNavBarActive}
      ></SideBar>
      <main>{children}</main>
    </>
  );
};

export default NavBar;
