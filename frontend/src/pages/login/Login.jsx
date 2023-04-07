import React, { useEffect, useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.svg";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../redux/features/auth/authService";
import {
  getLoginStatus,
  login,
  loginWithGoogle,
  RESET,
  sendLoginCode,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, email } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    isLoggedIn,
    isSuccess,
    message,
    isError,
    twoFactor,
    user,
  } = useSelector((state) => state.auth);

  const loginUser = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All field are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    const userData = {
      email: email.toLowerCase(),
      password,
    };
    dispatch(login(userData));
  };
  useEffect(() => {
    // if (isLoggedIn && user) {
    //   console.log("turetu redirectint i home");
    //   navigate("/");
    // }
    // dispatch(getLoginStatus());
    console.log("suveike");
    if (isSuccess && isLoggedIn && user?.isVerified === true) {
      navigate("/");
    }
    if (isError && twoFactor) {
      dispatch(sendLoginCode(email));
      navigate(`/loginWithCode/${email.toLowerCase()}`);
    }
    dispatch(RESET());
  }, [
    isLoggedIn,
    isSuccess,
    dispatch,
    navigate,
    email,
    isError,
    twoFactor,
    user,
  ]);

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginCard__container-logo">
          <img src={Logo} alt="logo" />
          <p>L2Soft</p>
        </div>
        <div className="loginCard__container-form">
          <form onSubmit={loginUser}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="email">Email</label>
            </div>
            <PasswordInput
              placeholder={"Password"}
              name={"password"}
              onChange={handleInputChange}
              value={password}
            />
            {/* <label htmlFor="password">Password</label> */}
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="loginCard__container-links">
          <Link to="/forgot">Forgot Password</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
