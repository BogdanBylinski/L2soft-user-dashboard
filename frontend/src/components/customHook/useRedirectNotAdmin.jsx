import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../redux/features/auth/authService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";

const useRedirectNotAdmin = (path) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.info("You are not admin");
      navigate(path);
    }
  }, [path, navigate, user]);
};

export default useRedirectNotAdmin;
