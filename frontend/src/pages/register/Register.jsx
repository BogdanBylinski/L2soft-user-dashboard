import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { validateEmail } from "../../redux/features/auth/authService";
import {
  register,
  RESET,
  sendVerificationEmail,
} from "../../redux/features/auth/authSlice";
import "./Register.scss";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const { name, password, email, confirmPassword } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [uCase, setUCase] = useState(false);
  const [num, setNum] = useState(false);
  const [sChar, setSChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  // const timesIcon = <FaTimes color="red" size={15} />;
  // const checkIcon = <BsCheck2All color="green" size={15} />;

  // const switchIcon = (condition) => {
  //   if (condition) {
  //     return checkIcon;
  //   }
  //   return timesIcon;
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    //Check Lower & UpperCase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUCase(true);
    } else {
      setUCase(false);
    }
    //Check for number
    if (password.match(/([0-9])/)) {
      setNum(true);
    } else {
      setNum(false);
    }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setSChar(true);
    } else {
      setSChar(false);
    }
    if (password.length > 5) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [password]);
  const registerUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All field are required");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    const userData = {
      email,
      password,
    };
    await dispatch(register(userData));
    // await dispatch(sendVerificationEmail());
  };
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/verifyEmailWasSent");
    }
    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);
  return (
    <>
      <div className="registerContainer">
        <div className="registerCard">
          <div className="registerCard__container-logo">
            <p>L2Soft</p>
          </div>
          <div className="registerCard__container-form">
            <form onSubmit={registerUser}>
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
              <PasswordInput
                placeholder={"ConfirmPassword"}
                name={"confirmPassword"}
                onChange={handleInputChange}
                value={confirmPassword}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Register
              </button>
            </form>
          </div>
          <div className="registerCard__container-links">
            {/* <Link to="/forgot">Forgot Password</Link> */}
            <p>Already registered?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Register;
