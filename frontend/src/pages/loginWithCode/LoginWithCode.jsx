import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./LoginWithCode.scss";
import {
  loginWithCode,
  RESET,
  sendLoginCode,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
const LoginWithCode = () => {
  // const [loginCode, setLoginCode] = useState("");
  const { email } = useParams();
  console.log(email);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isSuccess, user } = useSelector(
    (state) => state.auth
  );
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsCount = 6;
  const inputRef = useRef([]);
  const handleChange = (event, index) => {
    const value = event.target.value;
    if (isNaN(value)) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputRef.current[index + 1].focus();
    }
  };
  const pasteIntoInput = (e) => {
    const code = e.clipboardData.getData("text/plain").split("");
    if (code.length !== 6) {
      return;
    }
    setOtp(code);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
    if (event.key === "ArrowRight" && !otp[index] && index < 5) {
      inputRef.current[index + 1].focus();
    }
    if (event.key === "ArrowLeft" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };
  const sendUserLoginCode = async () => {
    await dispatch(sendLoginCode(email));
    await dispatch(RESET());
  };
  const loginUserWithCode = async (e) => {
    e.preventDefault();
    console.log(otp.join(""));
    if (otp.join("") === "") {
      return toast.error("Please fill in the login code");
    }
    if (otp.join("").length !== 6) {
      return toast.error("Access code must be 6 characters");
    }
    const code = {
      loginCode: otp.join(""),
    };
    await dispatch(loginWithCode({ code, email }));
  };
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate, user]);
  return (
    <div className="loginWithCodeContainer">
      <div className="loginWithCodeRow">
        <span>Check your email for login access code</span>
        <form className="loginWithCodeRow__form" onSubmit={loginUserWithCode}>
          {/* <input
          type="text"
          placeholder="Access Code"
          required
          name="loginCode"
          value={loginCode}
          onChange={(e) => setLoginCode(e.target.value)}
        /> */}
          <div className="loginWithCodeRow__form-otpInputs">
            {[...Array(otpInputsCount).keys()].map((digit, index) => (
              <input
                key={index}
                type="text"
                onPaste={(e) => pasteIntoInput(e)}
                value={otp[index]}
                maxLength="1"
                placeholder=" "
                onChange={(event) => handleChange(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                ref={(ref) => (inputRef.current[index] = ref)}
              />
            ))}
          </div>
          <button type="submit">Proceed To Login</button>
          {/* <div className="loginWithCodeRow__form-resend">
            {/* <p>
              <Link to="/">- Home</Link>
            </p> */}
          {/* <p onClick={sendUserLoginCode}>Resend Code</p> */}
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default LoginWithCode;
