const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  forgotPassword,
  sendVerificationForNewEmail,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
  deleteVerifiedEmail,
  getKey,
  verifyEmail,
  loginWithgoogle,
  deleteNotVerifiedEmail,
} = require("../controllers/userController");
const {
  protect,
  adminOnly,
  authorOnly,
} = require("../middleware/authMiddleware");
const limiter = require("../middleware/rateLimitMiddleware");
const router = express.Router();

router.post("/register", limiter(10), registerUser);
router.post("/login", limiter(200), loginUser);
router.get("/logout", limiter(10), logoutUser);
router.get("/getUser", limiter(50), protect, getUser);
router.patch("/updateUser", limiter(50), protect, updateUser);

router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/getUsers", limiter(100), protect, authorOnly, getUsers);
router.get("/loginStatus", limiter(500), loginStatus);
router.post("/upgradeUser", protect, adminOnly, upgradeUser);
router.post("/sendAutomatedEmail", limiter(10), protect, sendAutomatedEmail);
router.patch("/deleteVerifiedEmail", limiter(10), protect, deleteVerifiedEmail);
router.patch(
  "/deleteNotVerifiedEmail",
  limiter(10),
  protect,
  deleteNotVerifiedEmail
);

router.post(
  "/sendVerificationEmail",
  limiter(3),
  protect,
  sendVerificationEmail
);
router.post(
  "/sendVerificationForNewEmail",
  limiter(4),
  protect,
  sendVerificationForNewEmail
);
router.patch("/verifyUser/:verificationToken", limiter(5), verifyUser);
router.patch("/verifyEmail/:generatedToken", limiter(5), verifyEmail);
router.post("/forgotPassword", limiter(5), forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/changePassword", protect, changePassword);

router.post("/sendLoginCode/:email", sendLoginCode);
router.post("/loginWithCode/:email", loginWithCode);
router.get("/getKey", protect, getKey);

router.post("/google/callback", loginWithgoogle);

module.exports = router;
