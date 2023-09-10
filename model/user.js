const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  phoneNumber: String,
  password: String,
});

module.exports = mongoose.model("users", UserSchema);
