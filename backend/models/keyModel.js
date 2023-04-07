const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const keySchema = mongoose.Schema({
  saleDate: {
    type: Number,
    required: [true, "Please add a name"],
  },
  good: {
    type: String,
  },
  email: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  productName: {
    type: String,
  },
});

const Key = mongoose.model("Key", keySchema);

module.exports = Key;
