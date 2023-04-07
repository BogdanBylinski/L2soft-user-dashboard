import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  RESET,
  verifyEmail,
  verifyUser,
} from "../../redux/features/auth/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { useEffect } from "react";
import "./Verify.scss";
import useRedirecLoggedOutUser from "../../components/customHook/useRedirecLoggedOutUser";
const VerifyNewEmail = () => {
  const dispatch = useDispatch();
  useRedirecLoggedOutUser("/login");
  const redirection = () => {
    navigate("/");
  };
  const navigate = useNavigate();
  const { verificationToken } = useParams();
  const { isLoading, user } = useSelector((state) => state.auth);

  const verifyNewEmailAddress = async () => {
    await dispatch(verifyEmail(verificationToken));
    await dispatch(RESET());
    redirection();
  };
  useEffect(() => {
    if (user?.notVerifiedEmails.length === 0) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className="verifyContainer">
        <h2>Email Verification</h2>
        <p>To verify your account, click the button below...</p>
        <button onClick={verifyNewEmailAddress}>Verify Account</button>
      </div>
    </>
  );
};

export default VerifyNewEmail;
