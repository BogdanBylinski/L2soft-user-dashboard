import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";

const useRedirectNotVerified = (path) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  useEffect(() => {
    if (user && !user.isVerified) {
      toast.info("You are not verified");
      navigate(path);
    }
  }, [path, navigate, user]);
};

export default useRedirectNotVerified;
