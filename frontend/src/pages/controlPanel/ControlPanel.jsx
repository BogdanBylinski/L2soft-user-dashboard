import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRedirectNotAdmin from "../../components/customHook/useRedirectNotAdmin";
import { getUsers } from "../../redux/features/auth/authSlice";
import "./ControlPanel.scss";
const ControlPanel = () => {
  useRedirectNotAdmin("/");
  const { user, users } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);
  useEffect(() => {
    if (user && user.role !== "admin") {
      return <></>;
    }
  }, []);
  if (user && user.role === "admin") {
    return <div>ControlPanel</div>;
  }
};

export default ControlPanel;
