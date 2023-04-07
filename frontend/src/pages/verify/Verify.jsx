import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, RESET, verifyUser } from "../../redux/features/auth/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { useEffect } from "react";
import "./Verify.scss";

const Verify = () => {
  const dispatch = useDispatch();
  const redirection = () => {
    navigate("/");
  };
  const navigate = useNavigate();
  const { verificationToken } = useParams();
  const { isLoading, user } = useSelector((state) => state.auth);

  const verifyAccount = async () => {
    await dispatch(verifyUser(verificationToken));
    await dispatch(RESET());
    redirection();
  };
  useEffect(() => {
    if (user?.isVerified === true) {
      navigate("/");
    }
    // if (!user) {
    //   navigate("/login");
    // }
  }, [navigate, user]);

  return (
    <>
      {/* {isLoading && <Loader />} */}

      <div className="verifyContainer">
        <h2>Account Verification</h2>
        <p>To verify your account, click the button below...</p>

        <button onClick={verifyAccount} className="">
          Verify Account
        </button>
      </div>
    </>
  );
};

export default Verify;
