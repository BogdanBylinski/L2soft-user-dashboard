import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { validateEmail } from "../../redux/features/auth/authService";
import { forgotPassword, RESET } from "../../redux/features/auth/authSlice";
import "./Forgot.scss";
const Forgot = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter an email");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
    };
    await dispatch(forgotPassword(userData));
    await dispatch(RESET(userData));
  };
  return (
    <>
      <div className="forgotContainer">
        <div className="forgotCard">
          <div className="forgotCard__container-logo">
            <p>L2Soft</p>
          </div>
          <div className="forgotCard__container-form">
            <form onSubmit={forgot}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </div>

              <button type="submit" className="--btn --btn-primary --btn-block">
                Reset password
              </button>
            </form>
          </div>
          <div className="forgotCard__container-links">
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

export default Forgot;
