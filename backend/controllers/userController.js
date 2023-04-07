const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const parser = require("ua-parser-js");
const { generateToken, hashToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const Key = require("../models/keyModel");
const { response } = require("express");
const { OAuth2Client } = require("google-auth-library");
const { ObjectId } = require("mongodb");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  // Validation
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    res.status(400);
    throw new Error("Please enter valid email address");
  }
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all the required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  // Check if user exists
  const userExists = await User.findOne({ email: email });
  const emailExists = await User.find({ verifiedEmails: { $in: [email] } });
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
  console.log(userExists);
  console.log(emailExists.length !== 0);
  // console.log(userExists.verifiedEmails.includes(email));
  if (userExists || emailExists.length !== 0) {
    res.status(400);
    throw new Error("Email already in use");
  }
  // Get user agent
  const ua = parser(req.headers["user-agent"]);
  const userAgent = [ua.ua];
  //   console.log(ua);

  // Create new user
  const user = await User.create({
    // name,
    email,
    password,
    userAgent,
    allowedIPs: [ipAddress],
  });
  // Generate Token
  const token = generateToken(user._id);
  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const {
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
      allowedIPs,
    } = user;

    //////////////////////////
    const newuser = await User.findOne(_id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (newuser.isVerified) {
      res.status(400);
      throw new Error("User already verified");
    }
    // delete token if it exists in DB
    let token = await Token.findOne({ userId: _id });
    if (token) {
      await token.deleteOne();
    }
    // Create verification token and save to DB

    const verificationToken = crypto.randomBytes(32).toString("hex") + _id;
    console.log(verificationToken);

    // hash token and save
    const hashedToken = hashToken(verificationToken);
    await new Token({
      userId: _id,
      vToken: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000), // 1 hour
    }).save();

    // Construct Verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    //Send verification email
    const subject = "Verify Your Account - AUTH:B";
    const send_to = email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@outlook.com";
    const template = "verifyEmail";
    const name2 = "bobo";
    const link = verificationUrl;
    try {
      await sendEmail(
        subject,
        send_to,
        sent_from,
        reply_to,
        template,
        name,
        link
      );
      res.status(200).json({ message: "Verification Email sent" });
    } catch (err) {
      res.status(500);
      console.log(err);
      throw new Error("Email not send, please try again");
    }

    // /////////////////////////////
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
      verifiedEmails,
      notVerifiedEmails,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
// Send Verification Email
const sendVerificationEmail = asyncHandler(async (req, res) => {
  //   const user = await User.findOne(req.user._id);
  //   if (!user) {
  //     res.status(404);
  //     throw new Error("User not found");
  //   }
  //   if (user.isVerified) {
  //     res.status(400);
  //     throw new Error("User already verified");
  //   }
  //   // delete token if it exists in DB
  //   let token = await Token.findOne({ userId: user._id });
  //   if (token) {
  //     await token.deleteOne();
  //   }
  //   // Create verification token and save to DB
  //   const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  //   console.log(verificationToken);
  //   // hash token and save
  //   const hashedToken = hashToken(verificationToken);
  //   await new Token({
  //     userId: user._id,
  //     vToken: hashedToken,
  //     createdAt: Date.now(),
  //     expiresAt: Date.now() + 60 * (60 * 1000), // 1 hour
  //   }).save();
  //   // Construct Verification URL
  //   const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
  //   //Send verification email
  //   const subject = "Verify Your Account - AUTH:B";
  //   const send_to = user.email;
  //   const sent_from = process.env.EMAIL_USER;
  //   const reply_to = "noreply@outlook.com";
  //   const template = "verifyEmail";
  //   const name = user.name;
  //   const link = verificationUrl;
  //   try {
  //     await sendEmail(
  //       subject,
  //       send_to,
  //       sent_from,
  //       reply_to,
  //       template,
  //       name,
  //       link
  //     );
  //     res.status(200).json({ message: "Verification Email sent" });
  //   } catch (err) {
  //     res.status(500);
  //     console.log(err);
  //     throw new Error("Email not send, please try again");
  //   }
});
// Send Verification For New Email
const sendVerificationForNewEmail = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findById(req.user._id);

  const emailExists = await User.find({ verifiedEmails: { $in: [email] } });
  const userExists = await User.findOne({ email: email });
  console.log(emailExists, userExists);
  console.log(user.notVerifiedEmails.length);
  console.log(user.notVerifiedEmails);
  if (emailExists.length !== 0 || userExists) {
    res.status(404);
    throw new Error("Email is verified");
  }
  if (user.notVerifiedEmails.length > 0) {
    res.status(404);
    throw new Error("Verify previous email or delete and add new one");
  }
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (!user.isVerified) {
    res.status(400);
    throw new Error("First You have to verify your main Email");
  }
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    res.status(400);
    throw new Error("Please enter valid email address");
  }
  user.notVerifiedEmails = [...user.notVerifiedEmails, email];
  await user.save();
  console.log("saved");

  // delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  // Create verification token and save to DB

  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  const verificationEmailToken = crypto.randomBytes(10).toString("hex") + email;
  console.log(verificationToken);
  console.log(verificationEmailToken);

  // hash token and save
  const hashedToken = hashToken(verificationToken);
  const hashedEmail = hashToken(verificationEmailToken);
  await new Token({
    userId: user._id,
    eToken: hashedToken,
    eHashed: email,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 1 hour
  }).save();

  // Construct Verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verifyEmail/${verificationToken}`;

  //Send verification email
  const subject = "Verify Your Email";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@outlook.com";
  const template = "verifyEmail";
  const name = user.name;
  const link = verificationUrl;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({
      message: "Verification Email sent",
      email: email,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        photo: user.photo,
        role: user.role,
        isVerified: user.isVerified,
        token: user.token,
        verifiedEmails: user.verifiedEmails,
        notVerifiedEmails: user.notVerifiedEmails,
      },
    });
  } catch (err) {
    res.status(500);
    console.log(err);
    throw new Error("Email not send, please try again");
  }
});
// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email);
  //Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }
  const user = await User.findOne({ email: email.toLowerCase() });

  console.log(`user found ${user.email} `);
  if (!user) {
    res.status(404);
    throw new Error("User not found, please signup");
  }
  if (!user.isVerified) {
    res.status(404);
    throw new Error("Please verify your account");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  // Trigger 2FA for unknown UserAgent
  const ua = parser(req.headers["user-agent"]);
  const thisUserAgent = ua.ua;
  console.log(thisUserAgent);
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
  console.log(ipAddress);
  const allowedAgent = user.userAgent.includes(thisUserAgent);
  const allowedIP = user.allowedIPs.includes(ipAddress);
  if (!allowedAgent || !allowedIP) {
    // Generate 6 digit code
    const loginCode = Math.floor(100000 + Math.random() * 900000);
    console.log(loginCode);
    // Encrypt login code before saving to DB,
    const encryptedLoginCode = cryptr.encrypt(loginCode.toString());
    // delete token if it exists in DB
    let userToken = await Token.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }

    // Save token to DB
    await new Token({
      userId: user._id,
      lToken: encryptedLoginCode,
      ip: ipAddress,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000), // 1 hour
    }).save();
    res.status(400);
    throw new Error("New browser or device detected");
  }
  // Generate Token
  const token = generateToken(user._id);
  if (user && passwordIsCorrect) {
    // Send HTTP-Only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1day
      sameSite: "none",
      secure: true,
    });
    const {
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
    } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
      verifiedEmails,
      notVerifiedEmails,
    });
  } else {
    res.status(500);
    throw new Error("Something went wrong, please try again");
  }
});
// SEND LOGIN CODE VIA EMAIL
const sendLoginCode = asyncHandler(async (req, res) => {
  console.log(req.params, "params");
  const email = req.params.email.toLowerCase();

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // Find login code in DB
  const userToken = await Token.findOne({
    userId: user._id,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired token, please login again");
  }

  const loginCode = userToken.lToken;
  const decryptedLoginCode = cryptr.decrypt(loginCode);
  // Send login code via email
  //Send verification email
  const subject = "Login access code - AUTH:B";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@outlook.com";
  const template = "loginCode";
  const name = user.name;
  const link = decryptedLoginCode;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: `Access code was sent to ${email}` });
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("Email not send, please try again");
  }
});
//LOGIN WITH CODE
const loginWithCode = asyncHandler(async (req, res) => {
  const email = req.params.email.toLowerCase();
  const { loginCode } = req.body;
  console.log(email);
  console.log(loginCode);
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // Find user login token
  const userToken = await Token.findOne({
    userId: user.id,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token, please login again");
  }
  const decryptedLoginCode = cryptr.decrypt(userToken.lToken);
  if (loginCode !== decryptedLoginCode) {
    res.status(400);
    throw new Error("Incorrect login code, please try again");
  } else {
    //Register userAgent
    const ua = parser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
    user.userAgent.push(thisUserAgent);
    if (!user.allowedIPs.includes(ipAddress)) {
      user.allowedIPs.push(ipAddress);
    }
    await user.save();

    const token = generateToken(user._id);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1day
      sameSite: "none",
      secure: true,
    });

    const {
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
    } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
      verifiedEmails,
      notVerifiedEmails,
    });
    console.log("status send");
  }
});
//Verify Useer
const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }
  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  if (user.isVerified) {
    res.status(404);
    throw new Error("User is already verified");
  }
  // Now verify user
  user.isVerified = true;
  user.verifiedEmails = [...user.verifiedEmails, user.email];

  const {
    _id,
    name,
    email,
    phone,
    bio,
    photo,
    role,
    isVerified,
    verifiedEmails,
    notVerifiedEmails,
  } = user;
  await user.save();
  res.status(200).json({
    message: "Account Verification Successful",
  });
  await userToken.deleteOne();
});
//Verify New Email Useer
const verifyEmail = asyncHandler(async (req, res) => {
  const { generatedToken } = req.params;

  const hashedToken = hashToken(generatedToken);

  const userToken = await Token.findOne({
    eToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }
  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  if (user.verifiedEmails.includes(userToken.eHashed)) {
    res.status(404);
    throw new Error("User is already verified");
  }
  // Now verify user
  user.verifiedEmails = [...user.verifiedEmails, userToken.eHashed];
  user.notVerifiedEmails = [];
  const {
    _id,
    name,
    email,
    phone,
    bio,
    photo,
    role,
    isVerified,
    verifiedEmails,
    notVerifiedEmails,
  } = user;
  await user.save();
  res.status(200).json({
    email: userToken.eHashed,
    user: {
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
    },
    message: "New Email Verification Successful 625",
  });
  await userToken.deleteOne();
});
// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  // Send HTTP-Only cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //expires cookie
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logout successful" });
});
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const key = await Key.find({ email: { $in: user.verifiedEmails } });
  if (!key) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  const keyArr = key
    .filter((obj) => obj.good && obj.good.startsWith("L2"))
    .sort((a, b) => b.saleDate - a.saleDate);
  //  res.status(200).json(keyArr);
  if (user) {
    const {
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
    } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
      keyArr,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, bio, photo, role, isVerified } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      photo: updatedUser.photo,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.status(200).json({ message: "User was deleted successfuly" });
});
// DELETE EMAIL
const deleteVerifiedEmail = asyncHandler(async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.user._id);
  const email = req.body.item.toLowerCase();

  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    res.status(400);
    throw new Error("Please enter valid email address");
  }
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.verifiedEmails.includes(email) === false || user.email === email) {
    res.status(404);
    throw new Error("This email cant be deleted");
  }
  user.verifiedEmails = user.verifiedEmails.filter(
    (item) => item.toLowerCase() !== email.toLowerCase()
  );
  const updatedUser = await user.save();
  const key = await Key.find({ email: { $in: user.verifiedEmails } });
  if (!key) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  const keyArr = key
    .filter((obj) => obj.good && obj.good.startsWith("L2"))
    .sort((a, b) => b.saleDate - a.saleDate);
  //  res.status(200).json(keyArr);

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    bio: updatedUser.bio,
    photo: updatedUser.photo,
    role: updatedUser.role,
    isVerified: updatedUser.isVerified,
    verifiedEmails: updatedUser.verifiedEmails,
    notVerifiedEmails: updatedUser.notVerifiedEmails,
    keyArr,
  });
});
const deleteNotVerifiedEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const email = req.body.item.toLowerCase();

  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    res.status(400);
    throw new Error("Please enter valid email address");
  }
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (
    user.notVerifiedEmails.includes(email) === false ||
    user.email === email
  ) {
    res.status(404);
    throw new Error("This email cant be deleted");
  }
  // DELETE VERIFICATION TOKEN
  const token = await Token.findOne({ eHashed: email });
  if (token) {
    await token.deleteOne();
  }

  user.notVerifiedEmails = user.notVerifiedEmails.filter(
    (item) => item.toLowerCase() !== email.toLowerCase()
  );
  const updatedUser = await user.save();

  res.status(200).json({
    // _id: updatedUser._id,
    // name: updatedUser.name,
    // email: updatedUser.email,
    // phone: updatedUser.phone,
    // bio: updatedUser.bio,
    // photo: updatedUser.photo,
    // role: updatedUser.role,
    // isVerified: updatedUser.isVerified,
    // verifiedEmails: updatedUser.verifiedEmails,
    // notVerifiedEmails: updatedUser.notVerifiedEmails,
    message: "Not verified email was successful deleted",
  });
});

// Get Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");
  if (!users) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(users);
});
// Get Key
const getKey = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id });
  const key = await Key.find({ email: { $in: user.verifiedEmails } });
  if (!key) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  const keyArr = key
    .filter((obj) => obj.good && obj.good.startsWith("L2"))
    .sort((a, b) => b.saleDate - a.saleDate);
  res.status(200).json(keyArr);
});
// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});
const upgradeUser = asyncHandler(async (req, res) => {
  const { role, id } = req.body;

  // Find User by Id
  const user = await User.findById(id);
  if (!user) {
    res.status(500);
    throw new Error("User not found");
  }
  user.role = role;
  await user.save();
  res.status(200).json({ message: `User role update to ${role}` });
});

// Send automated emails
const sendAutomatedEmail = asyncHandler(async (req, res) => {
  const { subject, send_to, reply_to, template, url } = req.body;

  if (!subject || !send_to || !reply_to || !template) {
    res.status(404);
    throw new Error("Missing email parameter");
  }
  // Get user

  const user = await User.findOne({ email: send_to });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const send_from = process.env.EMAIL_USER;
  const name = user.name;
  const link = `${process.env.FRONTEND_URL}${url}`;
  try {
    await sendEmail(
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    res.status(500);
    console.log(err);
    throw new Error("Email not send, please try again");
  }
});

//FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  console.log(req.body);
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404);
    throw new Error("No user with this email");
  }
  // delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  // Create reset token and save to DB

  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // hash token and save
  const hashedToken = hashToken(resetToken);
  await new Token({
    userId: user._id,
    rToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 1 hour
  }).save();

  // Construct Verification URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  //Send verification email
  const subject = "Reset Your Password - AUTH:B";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@outlook.com";
  const template = "forgotPassword";
  const name = user.name;
  const link = resetUrl;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Reset Password Email sent" });
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("Email not send, please try again");
  }
});

// RESET PASSWORD

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const hashedToken = hashToken(resetToken);

  const userToken = await Token.findOne({
    rToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }
  // Find User
  const user = await User.findOne({ _id: userToken.userId });

  // Now Reset Password
  user.password = password;
  await user.save();
  res.status(200).json({ message: "Password Reset Successful, please login" });
});
// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please enter old and new password");
  }

  // Check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();

    res
      .status(200)
      .json({ message: "Password change successful, please re-login" });
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});
const loginWithgoogle = asyncHandler(async (req, res) => {
  const { userToken } = req.body;
  // console.log(userToken);
  const ticket = await client.verifyIdToken({
    idToken: userToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const { name, email, picture, sub } = payload;
  const password = Date.now() + sub;
  // Get user agent
  const ua = parser(req.headers["user-agent"]);
  const userAgent = [ua.ua];
  //   console.log(ua);

  // Check if user exists
  const user = await User.findOne({ email });
  // if user doesnt exist
  if (!user) {
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      userAgent,
      photo: picture,
      isVerified: true,
    });
    if (newUser) {
      // Generate Token
      const token = generateToken(newUser._id);
      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1day
        sameSite: "none",
        secure: true,
      });

      const {
        _id,
        name,
        email,
        phone,
        bio,
        photo,
        role,
        isVerified,
        verifiedEmails,
        notVerifiedEmails,
      } = newUser;
      res.status(201).json({
        _id,
        name,
        email,
        phone,
        bio,
        photo,
        role,
        isVerified,
        token,
        verifiedEmails,
        notVerifiedEmails,
      });
    }
  }
  // if user exist
  if (user) {
    const token = generateToken(user._id);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1day
      sameSite: "none",
      secure: true,
    });

    const {
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      verifiedEmails,
      notVerifiedEmails,
    } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
      verifiedEmails,
      notVerifiedEmails,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  sendVerificationForNewEmail,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
  loginWithgoogle,

  getKey,
  verifyEmail,
  deleteVerifiedEmail,
  deleteNotVerifiedEmail,
};
