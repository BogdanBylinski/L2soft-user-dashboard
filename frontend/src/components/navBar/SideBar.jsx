import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.scss";
import { ReactComponent as Close } from "../../assets/close.svg";
import { ReactComponent as Burger } from "../../assets/burger.svg";
import Logo from "../../assets/Logo.svg";
import { ReactComponent as Logout } from "../../assets/logout.svg";
import { ReactComponent as ListIcon } from "../../assets/keys.svg";
import { ReactComponent as Settings } from "../../assets/settings.svg";
import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as Cart } from "../../assets/cart.svg";
import { ReactComponent as Left } from "../../assets/left.svg";
import { ReactComponent as Right } from "../../assets/right.svg";
import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
const SideBar = ({ navBarActive, setNavBarActive }) => {
  const [navBarSize, setNavBarSize] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const closeSideBar = (e) => {
    e.stopPropagation();
    setNavBarActive(false);
  };
  const propagation = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      <div
        className={`sideBarContainer ${navBarActive ? "" : "hidden"}`}
        onClick={(e) => closeSideBar(e)}
      >
        <nav className={`sideBar ${navBarActive ? "shown" : "hidden"}`}>
          <div className="sideBar__item" onClick={(e) => propagation(e)}>
            <div className="sideBar__item-links ">
              <ul>
                <li onClick={closeSideBar}>
                  <NavLink to={"/"}>
                    <ListIcon />
                    <p>Keys</p>
                  </NavLink>
                </li>
                <li onClick={closeSideBar}>
                  <NavLink to={"/settings"}>
                    <Settings />
                    <p>Profile</p>
                  </NavLink>
                </li>
                {user && user.role === "admin" ? (
                  <li onClick={closeSideBar}>
                    <NavLink to={"/controlPanel"}>
                      <Settings />
                      <p>Admin Panel</p>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

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
        </nav>
      </div>
    </>
  );
};

export default SideBar;
