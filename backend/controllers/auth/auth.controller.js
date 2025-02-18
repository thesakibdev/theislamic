const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../../middleware/nodemailer.middleware");

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

    // ভেরিফিকেশন টোকেন জেনারেট
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = Date.now() + 3600000; // ১ ঘন্টা

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpires,
    });
    await newUser.save();

    // ভেরিফিকেশন ইমেইল পাঠানো
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"The Islamic Center"" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ইমেইল ভেরিফিকেশন",
      html: `
        <h2>আপনার ইমেইল ভেরিফাই করুন</h2>
        <p>অ্যাকাউন্ট এক্টিভেট করতে নিচের বাটনে ক্লিক করুন:</p>
        <a href="${verificationLink}">
          <button style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
            ভেরিফাই করুন
          </button>
        </a>
        <p>লিঙ্কটি ১ ঘন্টার মধ্যে এক্সপায়ার হবে</p>
      `,
    };

    // ইমেইল সেন্ডিং এর চেষ্টা
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("ইমেইল পাঠানোতে সমস্যা:", emailError);
      await User.deleteOne({ _id: newUser._id }); // রোলব্যাক
      return res.status(500).json({
        success: false,
        message: "ভেরিফিকেশন ইমেইল পাঠানো যায়নি। পরে আবার চেষ্টা করুন।",
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for verification.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// verify email
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "ভেরিফিকেশন টোকেন প্রয়োজন",
    });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "অবৈধ বা এক্সপায়ার্ড টোকেন",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "ইমেইল সফলভাবে ভেরিফাই করা হয়েছে!",
    });
  } catch (error) {
    console.error("ভেরিফিকেশনে ত্রুটি:", error);
    res.status(500).json({
      success: false,
      message: "ইন্টারনাল সার্ভার এরর",
    });
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
  fffdsg;

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

  console.log("User ID:", userId);
  console.log("User Role:", userRole);

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

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserRole,
  updateUserProfile,
};
