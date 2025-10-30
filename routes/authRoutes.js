const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authRequired } = require("../middleware/auth");
const router = express.Router();

router.post("/register", async (req, res) =>
{
  try
  {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) 
    {
        return res.status(400).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email } });
  }
  catch (errors)
  {
    res.status(500).json({ message: errors.message });
  }
});

router.post("/login", async (req, res) =>
{
  try
  {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
    {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: "7d",});
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  }
  catch (errors)
  {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", authRequired, async (req, res) =>
{
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
