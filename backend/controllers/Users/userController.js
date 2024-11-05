import User from "../../models/UserModels/UserSchema.js";
import ArtistProfile from "../../models/ArtistModels/ArtistSchema.js";
import RequesterProfile from "../../models/RequesterModels/RequesterSchema.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Utility function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Utility function to set secure cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  // Access token cookie - short lived
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie - longer lived
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/refresh-token", // Only sent to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Create a new user
export const createUser = async (req, res) => {
  const requestBody = req.body;
  console.log("Incoming request body:", requestBody);

  try {
    const { username, name, email, password, role, skills } = requestBody;

    // Enhanced validation
    if (
      !username?.trim() ||
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !role
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (existingUser) {
      const field =
        existingUser.username.toLowerCase() === username.toLowerCase()
          ? "username"
          : "email";
      return res
        .status(400)
        .json({ message: `This ${field} is already registered.` });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with verification token
    const user = new User({
      username: username.toLowerCase(),
      name,
      email: email.toLowerCase(),
      role,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    await user.save();

    // Create profile based on role
    if (role === "artist") {
      const artistProfile = new ArtistProfile({
        userId: user._id,
        skills: {
          primary: skills?.primary || [],
          secondary: skills?.secondary || [],
        },
      });
      await artistProfile.save();
    } else if (role === "requester") {
      const requesterProfile = new RequesterProfile({
        userId: user._id,
        company: requestBody.company || "",
      });
      await requesterProfile.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token
    await user.addRefreshToken(refreshToken, req.get("User-Agent"));

    // Set secure cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Send verification email (implement this based on your email service)
    // await sendVerificationEmail(user.email, verificationToken)

    // Return user data (excluding sensitive information)
    const userData = user.toObject();
    delete userData.passwordHash;
    delete userData.emailVerificationToken;
    delete userData.refreshTokens;

    res.status(201).json({
      user: userData,
      message: "User created successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Failed to create user.",
      error: process.env.NODE_ENV === "production" ? null : error.message,
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    try {
      await user.comparePassword(password);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        isEmailVerified: false,
      });
    }

    if (!user.active) {
      return res.status(403).json({ message: "Account is deactivated." });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token
    await user.addRefreshToken(refreshToken, req.get("User-Agent"));

    // Set secure cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user data
    const userData = user.toObject();
    delete userData.passwordHash;
    delete userData.refreshTokens;

    res.status(200).json({
      user: userData,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: process.env.NODE_ENV === "production" ? null : error.message,
    });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // If we have the user's refresh token, remove it from their tokens list
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken && req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t.token !== refreshToken
        );
        await user.save();
      }
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !(await user.validateRefreshToken(refreshToken))) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Update refresh token
    await user.addRefreshToken(tokens.refreshToken, req.get("User-Agent"));

    // Set new cookies
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Update user (protected route)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure user can only update their own profile
    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.passwordHash;
    delete updates.emailVerificationToken;
    delete updates.refreshTokens;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-passwordHash -refreshTokens -emailVerificationToken",
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Error updating user",
      error: process.env.NODE_ENV === "production" ? null : error.message,
    });
  }
};

export default {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  updateUser,
};
