import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BAKCEND_URL;
export const API_URL = `${BACKEND_URL}/api/users/`;
// Validate email
export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
// REGISTER USER

const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

//LOGIN USER
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  return response.data;
};

//LOGOUT USER
const logout = async () => {
  const response = await axios.get(API_URL + "logout");
  return response.data.message;
};
//GET LOGIN STATUS
const getLoginStatus = async () => {
  const response = await axios.get(API_URL + "loginStatus");
  return response.data;
};
//GET USER PROFILE
const getUser = async () => {
  const response = await axios.get(API_URL + "getUser");
  return response.data;
};
//UPDATE PROFILE
const updateUser = async (userData) => {
  const response = await axios.patch(API_URL + "updateUser", userData);
  console.log(userData);
  return response.data;
};
// SEND VERIFICATION EMAIL
const sendVerificationEmail = async () => {
  const response = await axios.post(API_URL + "sendVerificationEmail");
  return response.data.message;
};
// ADD NEW EMAIL
const addNewEmail = async (userData) => {
  const response = await axios.post(
    API_URL + "sendVerificationForNewEmail",
    userData
  );
  return response.data;
};
// VERIFY USER
const verifyUser = async (verificationToken) => {
  const response = await axios.patch(
    `${API_URL}verifyUser/${verificationToken}`,
    verificationToken
  );
  return response.data.message;
};
// VERIFY NEW EMAIL
const verifyEmail = async (verificationToken) => {
  const response = await axios.patch(
    `${API_URL}verifyEmail/${verificationToken}`,
    verificationToken
  );
  return response.data;
};
// VERIFY NEW EMAIL
const deleteVerifiedEmail = async (userData) => {
  const response = await axios.patch(`${API_URL}deleteVerifiedEmail`, userData);
  return response.data;
};
// VERIFY NEW EMAIL
const deleteNotVerifiedEmail = async (userData) => {
  const response = await axios.patch(
    `${API_URL}deleteNotVerifiedEmail`,
    userData
  );
  return response.data;
};
// CHANGE PASSWORD
const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "changePassword", userData);
  return response.data.message;
};
// FORGOT PASSWORD
const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgotPassword", userData);
  return response.data.message;
};
// RESET PASSWORD
const resetPassword = async (userData, resetToken) => {
  const response = await axios.patch(
    `${API_URL}resetPassword/${resetToken}`,
    userData
  );
  return response.data.message;
};
// GET USERS
const getUsers = async () => {
  const response = await axios.get(API_URL + "getUsers");

  return response.data;
};
// DELETE USERS
const deleteUser = async (id) => {
  const response = await axios.delete(API_URL + id);

  return response.data.message;
};
// UPGRADE USER
const upgradeUser = async (userData) => {
  const response = await axios.post(API_URL + "upgradeUser", userData);

  return response.data.message;
};
// Send Login Code
const sendLoginCode = async (email) => {
  const response = await axios.post(API_URL + `sendLoginCode/${email}`);

  return response.data.message;
};
// Login With Code
const loginWithCode = async (code, email) => {
  const response = await axios.post(API_URL + `loginWithCode/${email}`, code);

  return response.data.message;
};
// Login With Google
const loginWithGoogle = async (userToken) => {
  const response = await axios.post(API_URL + `google/callback`, userToken);

  return response.data.message;
};
// Get Keys
const getKeys = async (userData) => {
  const response = await axios.get(API_URL + `/getKey`, userData);

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getLoginStatus,
  getUser,
  updateUser,
  sendVerificationEmail,
  verifyUser,
  verifyEmail,
  changePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  upgradeUser,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  addNewEmail,
  deleteVerifiedEmail,
  deleteNotVerifiedEmail,
  getKeys,
};

export default authService;
