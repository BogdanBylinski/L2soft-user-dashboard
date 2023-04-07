import React from "react";
import AddNewEmail from "../../components/addNewEmail/AddNewEmail";
import ChangePassword from "../../components/changePassoword/ChangePassword";
import NavBar from "../../components/navBar/NavBar";
import "./Home.scss";
const Home = () => {
  return (
    <div className="homeContainer">
      <ChangePassword></ChangePassword>
      <AddNewEmail></AddNewEmail>
    </div>
  );
};

export default Home;
