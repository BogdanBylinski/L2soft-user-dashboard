import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNewEmail from "../../components/addNewEmail/AddNewEmail";
import ChangePassword from "../../components/changePassoword/ChangePassword";
import useRedirecLoggedOutUser from "../../components/customHook/useRedirecLoggedOutUser";
import useRedirectNotVerified from "../../components/customHook/useRedirectNotVerified";
import NavBar from "../../components/navBar/NavBar";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "../../redux/features/auth/authSlice";
import "./Settings.scss";
const Settings = () => {
  useRedirectNotVerified("/login");
  useRedirecLoggedOutUser("/login");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const [userObj, setUserObj] = useState({});
  // useEffect(() => {
  //   useDispatch(getUser());
  // }, [dispatch]);
  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);
  return (
    <div className="homeContainer">
      <ChangePassword user={user}></ChangePassword>
      <AddNewEmail user={user}></AddNewEmail>
    </div>
  );
};

export default Settings;
