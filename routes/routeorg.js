const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Org = require("../model/org");
const verifyToken = require("../middleware/verify");

app.post("/add", verifyToken, async (req, res) => {
  try {
    const { email, name, description } = req.body;

    // Check if Org exists
    //const existingOrg = await Org.findOne({ email });

    /* if (existingUser) {
      return (
        res
          // .status(400)
          .json({ message: "El teléfono ya se encuentra registrado" })
      );
    }*/

    // Create a new user
    const newOrg = new Org({ email, name, description });
    await newOrg.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = app;
