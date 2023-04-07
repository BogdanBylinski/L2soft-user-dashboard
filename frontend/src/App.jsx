import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
axios.defaults.withCredentials = true;
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import "./main.scss";
import Forgot from "./pages/forgot/Forgot";
import Keys from "./pages/keys/Keys";
import NavBar from "./components/navBar/NavBar";
import Settings from "./pages/settings/Settings";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";
import LoginWithCode from "./pages/loginWithCode/LoginWithCode";
import VerifyEmailWasSent from "./pages/verifyEmailWasSent/VerifyEmailWasSent";
import useRedirectNotVerified from "./components/customHook/useRedirectNotVerified";
import Verify from "./pages/verify/Verify";
import Reset from "./pages/reset/Reset";
import VerifyNewEmail from "./pages/verify/VerifyNewEmail";
import ControlPanel from "./pages/controlPanel/ControlPanel";
function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);
  return (
    <>
      <div className="app">
        <BrowserRouter>
          <ToastContainer
            className="toastifyFontColor"
            position="bottom-right"
            toastStyle={{ color: "crimson !important " }}
            autoClose={10000}
          />
          <Routes>
            {/* <Route
              path="/"
              element={
                <NavBar>
                  <Home />
                </NavBar>
              }
            /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/verify/:verificationToken" element={<Verify />} />
            <Route
              path="/verifyEmail/:verificationToken"
              element={<VerifyNewEmail />}
            />
            {/* <Route path="/changePassword" element={<ChangePassword />} /> */}
            {/* <Route path="/users" element={<UserList />} /> */}
            <Route path="/loginWithCode/:email" element={<LoginWithCode />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="*" element={<Login />} />

            <Route
              path="/controlPanel"
              element={
                <NavBar>
                  <ControlPanel />
                </NavBar>
              }
            />
            <Route path="/resetPassword/:resetToken" element={<Reset />} />
            <Route
              path="/verifyEmailWasSent"
              element={<VerifyEmailWasSent />}
            />
            <Route
              path="/settings"
              element={
                <NavBar>
                  <Settings />
                </NavBar>
              }
            />
            <Route
              path="/"
              element={
                <NavBar>
                  <Keys />
                </NavBar>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
