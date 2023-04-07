import React, { useState } from "react";
import PasswordInput from "../passwordInput/PasswordInput";
import "./ChangePassword.scss";
import useRedirecLoggedOutUser from "../customHook/useRedirecLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  changePassword,
  logout,
  RESET,
} from "../../redux/features/auth/authSlice";
import { sendAutomatedEmail } from "../../redux/features/email/emailSlice";
const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};
const ChangePassword = () => {
  useRedirecLoggedOutUser("/login");
  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const { isLoading, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const updatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !password || !password2) {
      return toast.error("All fields are required");
    }

    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      oldPassword,
      password,
    };
    const emailData = {
      subject: "Password Changed ",
      send_to: user.email,
      reply_to: "noreply@outlook.com",
      template: "changePassword",
      url: "/forgot",
    };
    await dispatch(changePassword(userData));
    await dispatch(sendAutomatedEmail(emailData));
    await dispatch(logout());
    await dispatch(RESET(userData));
    await navigate("/login");
  };

  return (
    <div className="changePasswordContainer">
      <div className="changePasswordContainer__title">
        <p>Change Password</p>
      </div>
      <div className="changePasswordContainer__form">
        <form onSubmit={updatePassword}>
          <PasswordInput
            placeholder={"Old Password"}
            name="oldPassword"
            value={oldPassword}
            onChange={handleInputChange}
          ></PasswordInput>
          <PasswordInput
            placeholder={"New Password"}
            name="password"
            value={password}
            onChange={handleInputChange}
          ></PasswordInput>
          <PasswordInput
            placeholder={"Confirm Password"}
            name="password2"
            value={password2}
            onChange={handleInputChange}
          ></PasswordInput>
          <button>Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
