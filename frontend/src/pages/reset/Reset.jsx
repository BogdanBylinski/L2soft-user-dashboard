import React, { useEffect } from "react";
import "./Reset.scss";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RESET, resetPassword } from "../../redux/features/auth/authSlice";
import PasswordInput from "../../components/passwordInput/PasswordInput";

const initialState = {
  password: "",
  password2: "",
};
const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;
  const { resetToken } = useParams();
  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const reset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!password2 || !password) {
      return toast.error("All field are required");
    }
    const userData = {
      password,
    };
    await dispatch(resetPassword({ userData, resetToken }));
  };
  useEffect(() => {
    if (isSuccess && message.includes("Reset Successful")) {
      navigate("/login");
    }
    dispatch(RESET());
  }, [dispatch, isSuccess, message, navigate]);
  return (
    <>
      <div className="registerContainer">
        <div className="registerCard">
          <div className="registerCard__container-logo">
            <p>L2Soft</p>
          </div>
          <div className="registerCard__container-form">
            <form onSubmit={reset}>
              <PasswordInput
                placeholder={"Password"}
                name={"password"}
                onChange={handleInputChange}
                value={password}
              />
              <PasswordInput
                placeholder={"ConfirmPassword"}
                name={"password2"}
                onChange={handleInputChange}
                value={password2}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Reset;
