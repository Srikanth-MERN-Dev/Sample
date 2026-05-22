const mongoose = require("mongoose");

const { userDB } = require("../config/db");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    roleBase: ["user", "admin"],
    default: "user",
  },
});

module.exports = userDB.model("User", userSchema);
