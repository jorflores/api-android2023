const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Org = require("../model/org");
const verifyToken = require("../middleware/verify");

app.post("/add", verifyToken, async (req, res) => {
  try {
    const { email, name, description } = req.body;

    const newOrg = new Org({ email, name, description });
    await newOrg.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = app;
