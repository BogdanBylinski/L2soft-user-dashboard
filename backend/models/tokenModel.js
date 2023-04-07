const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  vToken: {
    //verification token
    type: String,
    default: "",
  },
  rToken: {
    //reset token
    type: String,
    default: "",
  },
  lToken: {
    //login token
    type: String,
    default: "",
  },
  eToken: {
    //email token
    type: String,
    default: "",
  },
  ip: {
    //ip address
    type: String,
    default: "",
  },
  eHashed: {
    //email token
    type: String,
    default: "",
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
