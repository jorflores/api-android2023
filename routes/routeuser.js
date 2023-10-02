const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const verifyToken = require("../middleware/verify");
const bcrypt = require("bcrypt");
const Organization = require("../model/org");

// Registration Endpoint
app.post("/register", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res.json({ message: "El teléfono ya se encuentra registrado" });
    }

    let hashed_password = bcrypt.hashSync(password, 10);

    const newUser = new User({
      phoneNumber: phoneNumber,
      password: hashed_password,
    });
    await newUser.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Revisamos si el usuario existe.
    const user = await User.findOne({ phoneNumber });

    // Revisamos si el usuario no existe y si la contraseña no es la misma
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generamos el token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, userId: user._id },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token: token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.get("/protected", verifyToken, (req, res) => {
  console.log(req.user.userId);
  res.status(200).json({ message: "Acceso permitido" });
});

app.post("/add-favorite/:organizationId", verifyToken, async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const userId = req.user.userId;

    // Verificamos si existe la organizacion

    const user = await User.findById(userId);
    const organization = await Organization.findById(organizationId);

    console.log(user);
    console.log(organization);

    if (!user || !organization) {
      return res
        .status(404)
        .json({ message: "User or organization not found" });
    }

    if (!user.favoriteOrganizations.includes(organizationId)) {
      user.favoriteOrganizations.push(organizationId);
      await user.save();
      res.status(200).json({ message: "Organization added to favorites" });
    } else {
      res.status(400).json({ message: "Organization already in favorites" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete(
  "/remove-favorite/:organizationId",
  verifyToken,
  async (req, res) => {
    try {
      const organizationId = req.params.organizationId;
      const userId = req.user.userId;

      const user = await User.findById(userId);
      const organization = await Organization.findById(organizationId);

      if (!user || !organization) {
        return res
          .status(404)
          .json({ message: "User or organization not found" });
      }

      // Remove the organization from the user's favorites if it's present
      const index = user.favoriteOrganizations.indexOf(organizationId);
      if (index !== -1) {
        user.favoriteOrganizations.splice(index, 1);
        await user.save();
        res
          .status(200)
          .json({ message: "Organization removed from favorites" });
      } else {
        res.status(400).json({ message: "Organization not in favorites" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = app;
