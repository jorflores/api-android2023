const express = require("express");
const mongoose = require("mongoose");
const verifyToken = require("./middleware/verify");
const userRoutes = require("./routes/routeuser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_DB =
  process.env.MONGO_DB || "mongodb://127.0.0.1:27017/tc2007b_404";
dbConnect();

app.use(express.json());
app.use("/users", userRoutes);

// Use the middleware for protected routes
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function dbConnect() {
  if (process.env.MONGO_DB) {
    console.log("Connecting to MongoDB in the cloud!");
  } else {
    console.log(`Connecting to Local instance of MongoDB : ${MONGO_DB}`);
  }

  mongoose.connect(MONGO_DB).then(() => console.log("Connected to DB!"));
}