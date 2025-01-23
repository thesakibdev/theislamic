const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

//register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields in request body",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing email or password" });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password!" });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        name: checkUser.name,
      },
      process.env.JWT_SECRET, // Use environment variable
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          name: checkUser.name,
        },
      });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

//logout
const logoutUser = (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired! Please log in again.",
      });
    }
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};