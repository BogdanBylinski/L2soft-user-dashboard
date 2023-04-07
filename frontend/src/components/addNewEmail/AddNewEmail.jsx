import React, { useEffect, useState } from "react";
import "./AddNewEmail.scss";
import { ReactComponent as Confirmed } from "../../assets/confirmed.svg";
import { ReactComponent as NotConfirmed } from "../../assets/notConfirmed.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Trash } from "../../assets/trash.svg";
import { ReactComponent as Refresh } from "../../assets/refresh.svg";
import {
  addNewEmail,
  ADD_NEW_EMAIL,
  deleteNotVerifiedEmail,
  deleteVerifiedEmail,
  getUser,
  RESET,
  SUCCESSFUL_NOT_VERIFIED_EMAIL_DELETED,
} from "../../redux/features/auth/authSlice";
import Popup from "../popup/Popup";
const AddNewEmail = ({ user }) => {
  const [email, setEmail] = useState("");
  // useRedirecLoggedOutUser("/login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [verifiedEmails, setVerifiedEmails] = useState([]);
  const [notVerifiedEmails, setNotVerifiedEmails] = useState([]);
  // console.log(user.verifiedEmails);
  // useEffect(() => {
  //   useDispatch(getUser());
  // }, [dispatch]);

  useEffect(() => {
    if (user) {
      setVerifiedEmails(user.verifiedEmails);
      setNotVerifiedEmails(user.notVerifiedEmails);
    }
    // if (!user) {
    //   console.log("turetu redirectint i login");
    //   navigate("/login");
    // }
  }, [user]);
  const addNewEmailToList = (e) => {
    e.preventDefault();
    dispatch(addNewEmail({ user, email }));
    setEmail("");
  };
  const handleDeleteEmail = (item) => {
    dispatch(deleteNotVerifiedEmail({ user, item }));
  };
  const handleDeleteVerifiedEmail = (item) => {
    dispatch(deleteVerifiedEmail({ user, item }));
  };
  useEffect(() => {
    if (
      isSuccess &&
      !isLoading &&
      message === "Not verified email was successful deleted"
    ) {
      console.log("del not ver email");
      dispatch(SUCCESSFUL_NOT_VERIFIED_EMAIL_DELETED());
    }
    dispatch(RESET());
  }, [isSuccess, isLoading, message, dispatch]);
  return (
    <div className="emailContainer">
      <div className="emailContainer__title">
        <p>Manage Emails</p>
      </div>
      <div className="emailContainer__form">
        <form onSubmit={addNewEmailToList}>
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
          <button>Add new email</button>
        </form>
      </div>
      <div className="emailContainer__emailsList">
        <p>Verified Emails List</p>
        {user &&
          verifiedEmails.map((item, index) => (
            <div key={index} className="emailContainer__emailsList-item">
              <div className="emailLine">
                <div className="emailLine__email">
                  <input type="text" value={item} disabled />
                </div>
                {/* <div className="emailLine__status"> */}
                {/* <Confirmed className={"confirmed"} /> */}
                {/* <NotConfirmed className={"notConfirmed"} /> */}
                {/* </div> */}
                {item === user.email ? (
                  ""
                ) : (
                  <div className="emailLine__buttons">
                    <div className="emailLine__buttons-delete">
                      <Popup
                        item={item}
                        handleDelete={handleDeleteVerifiedEmail}
                      >
                        {/* <Trash></Trash> */}
                      </Popup>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="emailContainer__emailsList">
        <p>Not Verified Emails List</p>
        {notVerifiedEmails && notVerifiedEmails?.length <= 0
          ? ""
          : notVerifiedEmails.map((item, index) => (
              <div key={index} className="emailContainer__emailsList-item">
                <div className="emailLine">
                  <div className="emailLine__email">
                    <input type="text" value={item} disabled />
                  </div>
                  {/* <div className="emailLine__status"> */}
                  {/* <Confirmed className={"confirmed"} /> */}
                  {/* <NotConfirmed className={"notConfirmed"} /> */}
                  {/* </div> */}
                  <div className="emailLine__buttons">
                    <div className="emailLine__buttons-delete">
                      <Popup item={item} handleDelete={handleDeleteEmail}>
                        {/* <Trash></Trash> */}
                      </Popup>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AddNewEmail;
