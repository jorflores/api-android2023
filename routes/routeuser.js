const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../model/user");

// Registration Endpoint
app.post("/register", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check if the phone number is already registered
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return (
        res
          // .status(400)
          .json({ message: "El teléfono ya se encuentra registrado" })
      );
    }

    // Create a new user
    const newUser = new User({ phoneNumber, password });
    await newUser.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ phoneNumber });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generate and send a JWT token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

// Use the middleware for protected routes
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Acceso permitido" });
});

module.exports = app;
