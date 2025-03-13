const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../../middleware/nodemailer.middleware");
const dotenv = require("dotenv");

const User = require("../../models/user.model");

dotenv.config();

//register
const registerUser = async (req, res) => {
  const {
    name,
    phone,
    password,
    email,
    avatar,
    profession,
    companyName,
    designation,
    address,
  } = req.body;

  if (!name || !phone || !password) {
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
    const checkUser = await User.findOne({ phone: phone });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 16);

    const newUser = new User({
      name,
      phone,
      password: hashPassword,
      email,
      avatar,
      profession,
      companyName,
      designation,
      address,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      },
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password, phone } = req.body;

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
          id: checkUser._id,
          name: checkUser.name,
          role: checkUser.role,
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

// update user profile
const updateUserProfile = async (req, res) => {
  const { userId } = req.params; // Extract user ID from route params
  const { name, email, phone, companyName, designation, country, address } =
    req.body; // Extract fields from request body

  try {
    // **Step 1: Check if all required fields are provided**
    if (
      !name ||
      !email ||
      !phone ||
      !companyName ||
      !designation ||
      !country ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in request body",
      });
    }

    // **Step 2: Normalize input values**
    const normalizedData = {
      name: name.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      designation: designation.trim(),
      country: country.trim(),
      address: address.trim(),
    };

    // **Step 3: Find the user by ID**
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // **Step 4: Update user fields**
    Object.keys(normalizedData).forEach((key) => {
      user[key] = normalizedData[key]; // Dynamically update fields
    });

    // **Step 5: Save updated user to the database**
    const updatedUser = await user.save();

    // **Step 6: Respond with the updated user data**
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
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

//update user role
const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { userRole } = req.body;
  try {
    const normalizedUserRole = userRole.toLowerCase().trim();

    if (normalizedUserRole !== "editor") {
      return res.status(400).json({
        success: false,
        message: "Invalid user role. It should be 'editor'.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: normalizedUserRole },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      designation: user.designation,
      profession: user.profession,
      address: user.address,
      totalDonation: user.totalDonation,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserRole,
  updateUserProfile,
  getUserDetails,
};
