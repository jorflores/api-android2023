const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  phoneNumber: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  favoriteOrganizations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  ],
});

module.exports = mongoose.model("users", UserSchema);
