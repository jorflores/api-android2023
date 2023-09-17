const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  phoneNumber: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("users", UserSchema);
